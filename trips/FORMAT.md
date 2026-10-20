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
| `activity` | yes | `hike`, `bike` or `paddle`. Sets the colour theme (hike green, bike earthy brown, paddle blue and sage). `hike` and `bike` timing are built (a `bike` trip uses 18 km/h plus 1 h per 600 m climbed, and gain tuned for rolling terrain). `paddle` timing is not built yet. |
| `timezone` | yes | IANA name (e.g. `America/Vancouver`). Used for sunrise and sunset. |
| `declination` | no | Magnetic declination in degrees east, for the compass. Default 0. |
| `weather` | yes | `{ "lat": .., "lon": .. }`, a point near the middle of the trip for the forecast. |
| `dayColors` | no | List of colours for the days. Leave it out to use the shared default (muted orange, yellow, green, teal, purple). |
| `offline` | no | Map saving settings, see below. |
| `route` | yes | The whole route: `[[lat, lng, km], ...]`. `km` is distance from the start, rising. |
| `elevation` | yes | One elevation in metres per route point, same order and length as `route`. |
| `days` | yes | List of days, see below. |
| `sidetrips` | yes | Optional side routes (can be `[]`), see below. |
| `water` | yes | Water spots (can be `[]`), see below. |

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

- `packing` shows a "Packing list" button and `logistics` shows a "Pre-trip logistics" button, under the trip card on the home screen in the trip's own colour. A link that is missing is simply not shown. With no `prep` at all, no buttons are shown.
- Each link must start with `https://`.
- Links need internet and are never saved for offline use. Offline, tapping one shows a "Needs internet" message.
- This repo and site are public, so anyone can read these links. Share each Google file with friends by email (not "anyone with the link"), use the plain link without the `?usp=` or `ouid=` parts, and never put permit numbers or confirmation codes in a linked file that has open access.

## Offline map

- `{ "mode": "box", "padding": 0.15, "zoomMin": 11, "zoomMax": 15 }` saves a rectangle around the whole route. Good for short loops.
- `{ "mode": "corridor", "bufferKm": 2, "zoomMin": 11, "zoomMax": 15 }` saves only a strip along the route. Use this for long routes, or the phone runs out of space.

## Adding a trip

1. Build `trips/<id>/trip.json` from the route file and the trip plan.
2. Check that `route` and `elevation` have the same length and that days run from km 0 to the last route km with no gaps.
3. Add one line for it to `trips/index.json`: `{"id": "..", "name": "..", "short": "..", "region": "..", "activity": "hike", "days": 4, "km": 42.2}`. This is what the home screen shows. `short` is the short trip name used in the "Trip prep for ..." label.
4. Add the trip's Trip prep links to that same line if the group has shared Google files (see "Trip prep links" below).
5. Raise the version number `V` at the top of `sw.js` (and the `v=` numbers in `index.html` and `trip.html`, and `VER` in `app.js`) so phones pick up the new trip and save it for offline use.
