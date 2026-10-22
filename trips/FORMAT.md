# Trip file format (version 1)

Every trip is one file: `trips/<id>/trip.json`. The folder name is the trip `id`. The app reads everything it shows from this file. Nothing about a trip lives in the app code.

## Top-level fields

| Field | Required | Meaning |
|---|---|---|
| `format` | yes | Always `1` for now. |
| `id` | yes | Short unique name, lowercase letters, numbers and dashes (e.g. `olympic-high-divide`). Must match the folder name. |
| `name` | yes | Full trip title, shown at the top of the overview. |
| `short` | yes | Short name, used in share text. |
| `region` | yes | Where it is. Shown as "N days in the <region>". |
| `activity` | yes | `hike`, `bike` or `paddle`. Sets the colour theme (hike green, bike earthy brown, paddle blue and sage). `hike` and `bike` timing are built (a `bike` trip uses 18 km/h plus 1 h per 600 m climbed, and gain tuned for rolling terrain). `paddle` timing is built: 4 km/h for a loaded double sea kayak, scaled by pace (waiting for tides and breaks are not included). Paddle trips show no elevation or gain and loss. Their water button shows fresh water only (streams, springs and lakes within about 500 m of the route, from OpenStreetMap, so it depends on how well the area is mapped). Weather, Wind (hourly, 6 am to 8 pm), Rain (hourly chance and amount) and Tides each get their own dropdown. Hike and bike trips get separate Weather and Rain dropdowns too. |
| `timezone` | yes | IANA name (e.g. `America/Vancouver`). Used for sunrise and sunset. |
| `declination` | no | Magnetic declination in degrees east, for the compass. Default 0. |
| `weather` | yes | `{ "lat": .., "lon": .. }`, a point near the middle of the trip for the forecast. |
| `dayColors` | no | List of colours for the days. Leave it out to use the shared default (muted orange, yellow, green, teal, purple). |
| `offline` | no | Map saving settings, see below. |
| `route` | yes | The whole route: `[[lat, lng, km], ...]`. `km` is distance from the start, rising. |
| `elevation` | yes (not for `paddle`) | One elevation in metres per route point, same order and length as `route`. Leave it out for `paddle` trips. |
| `notes` | no | List of short notes shown in a box at the top of the overview. The first note is shown in bold in the highlight colour, so use it for a warning (for example a test trip). |
| `days` | yes | List of days, see below. |
| `sidetrips` | yes | Optional side routes (can be `[]`), see below. |
| `tides` | no | High and low tide times for the days of the trip, in a dropdown titled `Tides - <station>`. `{ "station": "Alert Bay", "code": "08280", "id": "<CHS station id>", "source": "Canadian Hydrographic Service predictions", "datum": "chart datum" }`. The app pulls the highs and lows from the CHS tide service (IWLS, time series `wlp-hilo`) when the trip date is set and saves them on the phone, so they work offline afterwards. Heights only, not currents. |
| `water` | yes | Water spots (can be `[]`), see below. Not used for `paddle` trips. |

## Days

```
{ "title": "..", "desc": "..", "from": 0, "to": 8.72,
  "stops": [[km, "Name", "Short description", "kind", lat?, lng?]] }
```

- `from` / `to` are route kilometres. Each day starts where the last one ended.
- `kind` is `s` (start of day), `e` (end of day), `c` (campsite) or `p` (point of interest).
- `lat` and `lng` are only needed when the stop is off the route (for example a camp on a spur).
- A day may later carry its own `"activity"` to mix bike, paddle and hike in one trip. The app ignores it for now.

## Side trips

`{ "name": "..", "day": 3, "points": [[lat, lng], ...] }`. Dashed line in the colour of that day (1 is the first day).

## Water

`{ "lat": .., "lng": .., "n": "Name", "d": metres_from_route, "km": route_km }`.

## Trip prep links (in `trips/index.json`)

Each trip's line in `trips/index.json` may have a `prep` object with up to two Google Doc or Sheet links:

`"prep": { "packing": "https://docs.google.com/...", "logistics": "https://docs.google.com/..." }`

- `packing` shows a "Packing list" button and `logistics` shows a "Pre-trip logistics" button, under the trip card on the home screen in the trip's own colour, below a thin divider. A link that is missing is simply not shown. With no `prep` at all, no buttons are shown.
- Each link must start with `https://`. To show a greyed-out placeholder button that does nothing, use `"soon"` instead of a link (shown as "Logistics (soon)").
- Links need internet and are never saved for offline use. Offline, tapping one shows a "Needs internet" message.
- This repo and site are public, so anyone can read these links. Share each Google file with friends by email (not "anyone with the link"), use the plain link without the `?usp=` or `ouid=` parts, and never put permit numbers or confirmation codes in a linked file that has open access.

## Offline map

- `{ "mode": "box", "padding": 0.15, "zoomMin": 11, "zoomMax": 15 }` saves a rectangle around the whole route. Good for short loops.
- `{ "mode": "corridor", "bufferKm": 2, "zoomMin": 11, "zoomMax": 15 }` saves only a strip along the route. Use this for long routes, or the phone runs out of space.

## Adding a trip

1. If you have a GPX route (Gaia, Komoot, AllTrails, Garmin...), start from it: `node tools/gpx-to-trip.js route.gpx --id <id> --name "<name>" --activity hike --region "<place>" --days 4 --add-to-index`. It writes `trips/<id>/trip.json` (simplified route, km, even day split, `offline` settings, weather point) and adds the home screen line. Options are listed at the top of `tools/gpx-to-trip.js` (`--day-ends 12,30,45` to choose where days end, `--use-gpx-elevation`, `--timezone`, `--declination`). Day titles, descriptions and stop names come out as `TODO` and must be filled in. Without a GPX, build the file by hand from the plan.
2. Fill in every `TODO`. Elevation and water spots for hike and bike trips are baked into the file (see the fields above); without them the first phone to open the trip must be online.
3. Check the file: `node tools/check-trips.js <id>` (no id checks every trip). Fix every ERROR. Read every WARNING.
4. Make sure the trip has its line in `trips/index.json`: `{"id": "..", "name": "..", "region": "..", "activity": "hike", "days": 4, "km": 42.2}` (the `--add-to-index` option does this).
5. Add the trip's Trip prep links to that same line if the group has shared Google files (see "Trip prep links" below).
6. Raise the version number `V` at the top of `sw.js` (and the `v=` numbers in `index.html` and `trip.html`, and `VER` in `app.js`) so phones pick up the new trip and save it for offline use.

## Past trips list

The "Past trips" dropdown on the home page shows the trips already done, newest first, as `year  name`. The old trips are a fixed list (`PAST` near the bottom of `index.html`). To add a trip once it has been done, add `"done": <year>` and `"short": "<name>"` to its line in `trips/index.json`, for example `"done": 2027, "short": "High Divide"`. It appears in the list automatically (2027 High Divide) at the right place, and the trip card stays on the home page. If `short` is left out, the full trip name is used. `tools/check-trips.js` checks the year.

## Tools (`tools/`)

- `check-trips.js`: checks trip files before publishing (fields, day and km continuity, stops inside their day, elevation length, `index.json` matches, leftover `TODO`).
- `gpx-to-trip.js`: turns a GPX route into a starting trip file (see "Adding a trip"). It does not fetch elevation, water spots or tide stations; those still need adding.

## Map symbol legend

The (i) button on the map (paddle trips only, left of the map style button) explains the base map's built-in symbols. Each activity has a fixed list (pictures are real OpenTopoMap symbols in `legend/`, listed in `legend.js`). A trip can override it with `"legend": ["peak", "campsite", ...]` using the keys in `legend.js`. The app cannot detect which symbols actually appear in an area.
