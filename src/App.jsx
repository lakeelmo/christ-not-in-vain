import { useState, useEffect, useMemo } from 'react'
import { MapContainer, TileLayer, GeoJSON, useMap } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import './App.css'

const MN_CENTER = [46.2, -94.3]
const BASE = import.meta.env.BASE_URL

function slug(name) {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, '-')
}

function FitBounds({ geojson, selected }) {
  const map = useMap()
  useEffect(() => {
    if (!geojson) return
    const layer = L.geoJSON(geojson)
    map.fitBounds(layer.getBounds(), { padding: [30, 30], maxZoom: 8 })
  }, [geojson, map])
  useEffect(() => {
    if (!selected || !geojson) return
    const feat = geojson.features.find(f => String(parseInt(f.properties.SLDU, 10)) === String(selected))
    if (feat) {
      const layer = L.geoJSON(feat)
      map.fitBounds(layer.getBounds(), { padding: [60, 60], maxZoom: 9 })
    }
  }, [selected, geojson, map])
  return null
}

function QuoteCard({ quote, type }) {
  return (
    <article className={`quote-card quote-${type}`}>
      <div className="quote-theme">{quote.theme}</div>
      <blockquote>"{quote.text}"</blockquote>
      <p className="quote-context">{quote.context} · {quote.date}</p>
      <p className="quote-nt">{type === 'hypocrisy' ? quote.ntContrast : quote.ntAlignment}</p>
      {quote.note && <p className="quote-note">{quote.note}</p>}
      <div className="sources">
        <span className="sources-label">Sources:</span>
        {quote.sources?.map((s, i) => (
          <a key={i} href={s.url} target="_blank" rel="noopener noreferrer">{s.label}</a>
        ))}
      </div>
    </article>
  )
}

function DistrictPanel({ district, data, onClose }) {
  if (!data) return null
  const isR = data.party === 'R'
  return (
    <aside className="panel" role="dialog" aria-label={`District ${district} details`}>
      <button className="panel-close" onClick={onClose} aria-label="Close">×</button>
      <div className="panel-header">
        <span className={`party-badge party-${data.party}`}>{data.party === 'R' ? 'Republican' : 'DFL'}</span>
        <h2>District {district}</h2>
        <h3>{data.senator}</h3>
        {!data.hasDirectQuotes && (
          <p className="fallback-note">Showing caucus-level documented record. Tap sources to verify.</p>
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
    </aside>
  )
}

export default function App() {
  const [geojson, setGeojson] = useState(null)
  const [districtData, setDistrictData] = useState(null)
  const [selected, setSelected] = useState(null)
  const [filter, setFilter] = useState('all')

  useEffect(() => {
    Promise.all([
      fetch(`${BASE}data/senate-districts.geojson`).then(r => r.json()),
      fetch(`${BASE}data/districts.json`).then(r => r.json()),
    ]).then(([geo, data]) => {
      setGeojson(geo)
      setDistrictData(data.districts)
    })
  }, [])

  const style = useMemo(() => ({
    color: '#003865',
    weight: 1.5,
    fillOpacity: 0.55,
  }), [])

  const getStyle = (feature) => {
    const d = String(parseInt(feature.properties.SLDU, 10))
    const info = districtData?.[d]
    const party = info?.party
    let fill = '#94b8d4'
    if (party === 'R') fill = selected === d ? '#e85d4c' : '#c0392b'
    if (party === 'D') fill = selected === d ? '#2ecc71' : '#27ae60'
    return { ...style, fillColor: fill, fillOpacity: selected === d ? 0.85 : 0.6 }
  }

  const onEach = (feature, layer) => {
    const d = String(parseInt(feature.properties.SLDU, 10))
    const info = districtData?.[d]
    if (!info) return
    layer.bindTooltip(`District ${d}: ${info.senator} (${info.party})`, { sticky: true })
    layer.on('click', () => setSelected(d))
  }

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

  const stats = useMemo(() => {
    if (!districtData) return null
    const vals = Object.values(districtData)
    return {
      r: vals.filter(v => v.party === 'R').length,
      d: vals.filter(v => v.party === 'D').length,
      quoted: vals.filter(v => v.hasDirectQuotes).length,
    }
  }, [districtData])

  return (
    <div className="app">
      <header className="hero" style={{ backgroundImage: `url(${BASE}hero.png)` }}>
        <div className="hero-overlay">
          <p className="eyebrow">A citizen transparency project · Minnesota Senate</p>
          <h1>They invoke Christ's name — <em>in vain.</em></h1>
          <p className="hero-lead">
            Explore every district. Read the quotes. Check the sources. Choose prosperity for all.
          </p>
          {stats && (
            <div className="hero-stats">
              <span><strong>{stats.r}</strong> Republican districts</span>
              <span><strong>{stats.d}</strong> DFL districts</span>
              <span><strong>{stats.quoted}+</strong> directly sourced quotes</span>
            </div>
          )}
        </div>
      </header>

      <main className="main">
        <div className="map-wrap">
          <div className="map-controls">
            <h2>Interactive District Map</h2>
            <p>Click a district to see sourced quotes and New Testament contrast.</p>
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
            </div>
          </div>
          {geojson && (
            <MapContainer center={MN_CENTER} zoom={6} className="map" scrollWheelZoom={true}>
              <TileLayer attribution='&copy; OpenStreetMap' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
              <GeoJSON key={filter + selected} data={filteredFeatures} style={getStyle} onEachFeature={onEach} />
              <FitBounds geojson={geojson} selected={selected} />
            </MapContainer>
          )}
        </div>

        {selected && districtData?.[selected] && (
          <DistrictPanel district={selected} data={districtData[selected]} onClose={() => setSelected(null)} />
        )}

        {!selected && (
          <section className="intro-grid">
            <div className="intro-card intro-hypo">
              <h3>They invoke Christ</h3>
              <p>Documented quotes from MN Senate Republicans — with links to original reporting and public record.</p>
            </div>
            <div className="intro-card intro-nt">
              <h3>Christ actually taught</h3>
              <p>Every hypocrisy row paired with the New Testament verse it contradicts. Transparency, not spin.</p>
            </div>
            <div className="intro-card intro-better">
              <h3>We can be better</h3>
              <p>Prosperity for all: feed people, love neighbors, build a future every Minnesotan inherits.</p>
            </div>
          </section>
        )}
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
