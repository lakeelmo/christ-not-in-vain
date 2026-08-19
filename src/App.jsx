import { useState, useEffect, useMemo, useCallback } from 'react'
import { MapContainer, TileLayer, GeoJSON, useMap } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import './App.css'

const MN_CENTER = [46.2, -94.3]
const BASE = import.meta.env.BASE_URL
const ALL = 'all'

function FitBounds({ geojson, selected }) {
  const map = useMap()
  useEffect(() => {
    if (!geojson) return
    if (selected && selected !== ALL) {
      const feat = geojson.features.find(f => String(parseInt(f.properties.SLDU, 10)) === String(selected))
      if (feat) {
        map.fitBounds(L.geoJSON(feat).getBounds(), { padding: [60, 60], maxZoom: 9 })
        return
      }
    }
    map.fitBounds(L.geoJSON(geojson).getBounds(), { padding: [30, 30], maxZoom: 8 })
  }, [geojson, map, selected])
  return null
}

function QuoteCard({ quote, type }) {
  return (
    <article className={`quote-card quote-${type}`}>
      <div className="quote-theme">{quote.theme}</div>
      <blockquote>&ldquo;{quote.text}&rdquo;</blockquote>
      <p className="quote-context">{quote.context} · {quote.date}</p>
      {quote.ntRef && (
        <div className="quote-nt-block">
          <p className="quote-nt-ref">{type === 'hypocrisy' ? 'Christ actually taught' : 'Scripture alignment'} — {quote.ntRef}</p>
          <p className="quote-nt-text">&ldquo;{quote.ntText}&rdquo;</p>
        </div>
      )}
      {quote.humor && <p className="quote-humor"><span className="quote-tag">The irony</span> {quote.humor}</p>}
      {quote.inclusiveFuture && <p className="quote-future"><span className="quote-tag">We can be better</span> {quote.inclusiveFuture}</p>}
      {quote.note && <p className="quote-note">{quote.note}</p>}
      <div className="sources">
        <span className="sources-label">Sources</span>
        {quote.sources?.map((s, i) => (
          <a key={i} href={s.url} target="_blank" rel="noopener noreferrer">{s.label}</a>
        ))}
      </div>
    </article>
  )
}

function StatewidePanel({ statewide, districtData, onSelect }) {
  if (!statewide) return null
  return (
    <div className="panel-body statewide-body">
      <div className="statewide-intro">
        <h3>All of Minnesota</h3>
        <p>{statewide.message}</p>
      </div>
      <div className="statewide-stats">
        <div className="stat-chip"><strong>{statewide.republican}</strong> Republican districts</div>
        <div className="stat-chip"><strong>{statewide.dfl}</strong> DFL districts</div>
        <div className="stat-chip accent"><strong>67/67</strong> senators sourced</div>
      </div>
      <section className="panel-section">
        <h4>Story highlights — pick one</h4>
        <div className="highlight-list">
          {statewide.highlights.map(h => {
            const d = districtData?.[String(h.district)]
            return (
              <button key={h.district} className="highlight-btn" onClick={() => onSelect(String(h.district))}>
                <span className="highlight-d">District {h.district}</span>
                <span className="highlight-label">{h.label}</span>
                {d && <span className={`highlight-party party-${d.party}`}>{d.senator}</span>}
              </button>
            )
          })}
        </div>
      </section>
      <section className="panel-section section-better">
        <h4>Why this map exists</h4>
        <p className="statewide-why">
          Some Minnesota senators hand out commemorative Bibles while voting against feeding hungry kids.
          Others live the New Testament — welcoming neighbors, expanding healthcare, defending dignity.
          Every quote here is linked to original reporting. Click a district and watch this panel update.
        </p>
      </section>
    </div>
  )
}

function DistrictPanelContent({ district, data }) {
  if (!data) return <p className="panel-loading">Loading district data…</p>
  const isR = data.party === 'R'
  return (
    <div className="panel-body district-body" key={district}>
      <div className="panel-header">
        <span className={`party-badge party-${data.party}`}>{data.party === 'R' ? 'Republican' : 'DFL'}</span>
        <h2>District {district}</h2>
        <h3>{data.senator}</h3>
        {!data.hasDirectQuotes && (
          <p className="fallback-note">Additional caucus context shown. Follow source links to verify this senator&apos;s individual record.</p>
        )}
      </div>

      {isR && data.hypocrisy?.length > 0 && (
        <section className="panel-section">
          <h4>Christ invoked in vain</h4>
          {data.hypocrisy.map((q, i) => <QuoteCard key={i} quote={q} type="hypocrisy" />)}
        </section>
      )}

      {!isR && data.faith?.length > 0 && (
        <section className="panel-section">
          <h4>Living the New Testament</h4>
          {data.faith.map((q, i) => <QuoteCard key={i} quote={q} type="faith" />)}
        </section>
      )}

      {isR && data.faith?.length > 0 && (
        <section className="panel-section section-exception">
          <h4>When they got it right</h4>
          {data.faith.map((q, i) => <QuoteCard key={i} quote={q} type="faith" />)}
        </section>
      )}

      <section className="panel-section section-better">
        <h4>We can be better</h4>
        <p>{data.betterPath}</p>
      </section>

      <a className="bio-link" href={data.bioUrl} target="_blank" rel="noopener noreferrer">
        View official Senate bio →
      </a>
    </div>
  )
}

export default function App() {
  const [geojson, setGeojson] = useState(null)
  const [districtData, setDistrictData] = useState(null)
  const [statewide, setStatewide] = useState(null)
  const [selected, setSelected] = useState(ALL)
  const [filter, setFilter] = useState('all')

  useEffect(() => {
    Promise.all([
      fetch(`${BASE}data/senate-districts.geojson`).then(r => r.json()),
      fetch(`${BASE}data/districts.json`).then(r => r.json()),
    ]).then(([geo, data]) => {
      setGeojson(geo)
      setDistrictData(data.districts)
      setStatewide(data.statewide)
    })
  }, [])

  const style = useMemo(() => ({
    color: '#003865',
    weight: 1.5,
    fillOpacity: 0.55,
  }), [])

  const getStyle = useCallback((feature) => {
    const d = String(parseInt(feature.properties.SLDU, 10))
    const info = districtData?.[d]
    const party = info?.party
    let fill = '#94b8d4'
    if (party === 'R') fill = selected === d ? '#e85d4c' : '#c0392b'
    if (party === 'D') fill = selected === d ? '#2ecc71' : '#27ae60'
    const isSelected = selected === d
    const dimmed = selected !== ALL && !isSelected
    return {
      ...style,
      fillColor: fill,
      fillOpacity: isSelected ? 0.9 : dimmed ? 0.25 : 0.6,
      weight: isSelected ? 3 : 1.5,
      color: isSelected ? '#f5b800' : '#003865',
    }
  }, [districtData, selected, style])

  const onEach = useCallback((feature, layer) => {
    const d = String(parseInt(feature.properties.SLDU, 10))
    const info = districtData?.[d]
    if (!info) return
    layer.bindTooltip(`District ${d}: ${info.senator} (${info.party})`, { sticky: true })
    layer.on('click', () => setSelected(d))
  }, [districtData])

  const filteredFeatures = useMemo(() => {
    if (!geojson || !districtData || filter === 'all') return geojson
    return {
      ...geojson,
      features: geojson.features.filter(f => {
        const d = String(parseInt(f.properties.SLDU, 10))
        return districtData[d]?.party === filter
      }),
    }
  }, [geojson, districtData, filter])

  const sortedDistricts = useMemo(() => {
    if (!districtData) return []
    return Object.values(districtData).sort((a, b) => a.district - b.district)
  }, [districtData])

  const stats = useMemo(() => {
    if (!statewide) return null
    return {
      r: statewide.republican,
      d: statewide.dfl,
      quoted: statewide.directQuotes,
      totalQuotes: statewide.totalQuoteCount,
    }
  }, [statewide])

  const isStatewide = selected === ALL

  return (
    <div className="app">
      <header className="hero" style={{ backgroundImage: `url(${BASE}hero.png)` }}>
        <div className="hero-overlay">
          <p className="eyebrow">A citizen transparency project · Minnesota Senate</p>
          <h1>They invoke Christ&apos;s name — <em>in vain.</em></h1>
          <p className="hero-lead">
            Explore every district. Read the quotes. Check the sources. Choose prosperity for all.
          </p>
          {stats && (
            <div className="hero-stats">
              <span><strong>{stats.r}</strong> Republican districts</span>
              <span><strong>{stats.d}</strong> DFL districts</span>
              <span><strong>{stats.quoted}</strong> senators sourced</span>
              {stats.totalQuotes && <span><strong>{stats.totalQuotes}+</strong> verified quotes</span>}
            </div>
          )}
        </div>
      </header>

      <main className="main">
        <div className="explorer">
          <div className="map-column">
            <div className="map-controls">
              <h2>Interactive District Map</h2>
              <p>Click a district — or use the dropdown — and watch the results panel update.</p>
              <label className="district-select-label" htmlFor="district-select">Jump to district</label>
              <select
                id="district-select"
                className="district-select"
                value={selected}
                onChange={e => setSelected(e.target.value)}
              >
                <option value={ALL}>All Minnesota (statewide overview)</option>
                {sortedDistricts.map(d => (
                  <option key={d.district} value={String(d.district)}>
                    District {d.district} — {d.senator} ({d.party})
                  </option>
                ))}
              </select>
              <div className="filters">
                {['all', 'R', 'D'].map(f => (
                  <button key={f} className={filter === f ? 'active' : ''} onClick={() => setFilter(f)}>
                    {f === 'all' ? 'All' : f === 'R' ? 'Republican' : 'DFL'}
                  </button>
                ))}
              </div>
              <div className="legend">
                <span className="leg-r">Republican</span>
                <span className="leg-d">DFL</span>
                <span className="leg-sel">Selected</span>
              </div>
            </div>
            {geojson && (
              <MapContainer center={MN_CENTER} zoom={6} className="map" scrollWheelZoom={true}>
                <TileLayer attribution="&copy; OpenStreetMap" url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                <GeoJSON key={`${filter}-${selected}`} data={filteredFeatures} style={getStyle} onEachFeature={onEach} />
                <FitBounds geojson={geojson} selected={selected} />
              </MapContainer>
            )}
          </div>

          <aside className="results-panel" aria-live="polite" aria-label="District results">
            <div className="results-panel-header">
              <h2>{isStatewide ? 'Minnesota Overview' : `District ${selected}`}</h2>
              {!isStatewide && (
                <button className="back-all-btn" onClick={() => setSelected(ALL)}>← All Minnesota</button>
              )}
            </div>
            {isStatewide ? (
              <StatewidePanel statewide={statewide} districtData={districtData} onSelect={setSelected} />
            ) : (
              <DistrictPanelContent district={selected} data={districtData?.[selected]} />
            )}
          </aside>
        </div>

        <section className="intro-grid">
          <div className="intro-card intro-hypo">
            <h3>They invoke Christ</h3>
            <p>Documented quotes from MN Senate Republicans — with links to original reporting and public record.</p>
          </div>
          <div className="intro-card intro-nt">
            <h3>Christ actually taught</h3>
            <p>Every hypocrisy row paired with the New Testament verse it contradicts. Full verse text, not just references.</p>
          </div>
          <div className="intro-card intro-better">
            <h3>We can be better</h3>
            <p>Prosperity for all: feed people, love neighbors, build a future every Minnesotan inherits.</p>
          </div>
        </section>
      </main>

      <footer className="site-footer">
        <p className="disclaimer">
          This site reflects the views of a <strong>single citizen</strong> speaking their mind.
          It is not affiliated with any political party, campaign, church, or platform.
          All quotes are attributed to public records and linked to sources for verification.
          Caricatures and editorial design are satire. Verify everything. Think for yourself.
        </p>
        <p className="footer-tags">#ChristNotInVain · #ProsperityForAll · #MNLeg · #WeCanBeBetter</p>
      </footer>
    </div>
  )
}
