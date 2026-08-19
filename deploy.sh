#!/bin/bash
# Deploy to lakeelmo/christ-not-in-vain on GitHub Pages
# Requires: gh auth login OR export GH_TOKEN=your_pat

set -e
cd "$(dirname "$0")"

GITHUB_PAGES=true npm run build

if ! gh auth status &>/dev/null; then
  echo "ERROR: Run 'gh auth login' first, or set GH_TOKEN"
  echo "Then re-run: ./deploy.sh"
  exit 1
fi

if ! gh repo view lakeelmo/christ-not-in-vain &>/dev/null; then
  gh repo create lakeelmo/christ-not-in-vain --public --source=. --remote=origin --push
else
  git push -u origin main
fi

gh api repos/lakeelmo/christ-not-in-vain/pages -X POST \
  -f build_type=workflow \
  -f source[branch]=main \
  -f source[path]=/ 2>/dev/null || true

echo ""
echo "Deployed! Site will be live at:"
echo "  https://lakeelmo.github.io/christ-not-in-vain/"
echo ""
echo "Enable GitHub Pages: Repo Settings > Pages > Source: GitHub Actions"
