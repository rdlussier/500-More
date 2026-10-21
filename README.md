# 500 More

An app for trip itineraries (hiking, biking, paddling). Open it, pick a trip, and see the day-by-day plan, stats, offline map and weather.

- `index.html` is the home screen that lists the trips (`trips/index.json`).
- `trip.html` shows one trip (`trip.html?t=<trip id>`), using `app.js`.
- `trips/<id>/trip.json` is one trip. The format is described in `trips/FORMAT.md`.
- `sw.js` saves the app, every trip and the map tiles you choose for offline use.

The High Divide app (Olympic Mountains) lives in its own repository and is not part of this app.
- `tools/` has helpers for adding trips: `gpx-to-trip.js` (GPX route to starting trip file) and `check-trips.js` (checks trip files before publishing). Steps are in `trips/FORMAT.md`.
