# Bluetooth Beacon API (Proximity Marketing)

Use these endpoints from a **mobile app or PWA** that scans for BLE beacons (iBeacon/Eddystone). When a device enters a beacon’s range, the app can fetch the assigned ad and show it, then report events for monitoring.

## 1. Get content to show (when user is near a beacon)

**GET** `/api/beacons/content/:uuid/:major?/:minor?`

- **uuid** (required): iBeacon UUID, e.g. `3ce2ef69-4414-469d-9d55-3ec7fcc38520`
- **major**, **minor** (optional): default `0` if omitted

**Response (200):**

```json
{
  "beaconId": 1,
  "name": "Mall North Entrance",
  "locationName": "Sandton City",
  "ad": {
    "id": 5,
    "title": "Summer Sale",
    "headline": "20% off",
    "description": "...",
    "destinationUrl": "https://...",
    "contentText": "...",
    "contentImages": ["https://..."],
    "cta": "Shop Now"
  }
}
```

If the beacon has no assigned ad or the ad is not published, `ad` is `null`.

---

## 2. Report an event (enter / exit / impression / click / dwell)

**POST** `/api/beacons/event`  
**Body (JSON):**

| Field       | Type   | Required | Description |
|------------|--------|----------|-------------|
| beaconId   | number | one of   | Beacon ID (from content response) |
| uuid       | string | one of   | Beacon UUID (with major/minor if no beaconId) |
| major      | number | no       | Default 0 |
| minor      | number | no       | Default 0 |
| eventType  | string | yes      | `enter` \| `exit` \| `impression` \| `click` \| `dwell` |
| deviceId   | string | no       | Anonymous device/session identifier |
| sessionId  | string | no       | Session identifier |
| adId       | number | no       | Ad that was shown (defaults to beacon’s assigned ad) |
| metadata   | object | no       | Extra data (e.g. dwell seconds) |

**Example:**

```json
{
  "beaconId": 1,
  "eventType": "impression",
  "deviceId": "anon-abc123",
  "sessionId": "sess-xyz"
}
```

**Response (201):** `{ "id": 42, "ok": true }`

---

## Platform (dashboard) APIs

- **GET** `/api/beacons` – List beacons (query: `area`, `status`)
- **GET** `/api/beacons/areas` – Distinct area names
- **GET** `/api/beacons/performance` – Aggregated stats by beacon and by area (query: `area`, `from`, `to`)
- **GET** `/api/beacons/:id` – Single beacon
- **POST** `/api/beacons` – Create beacon (auth)
- **PUT** `/api/beacons/:id` – Update beacon (auth)
- **DELETE** `/api/beacons/:id` – Delete beacon (auth)

Beacon payload for create/update: `name`, `uuid`, `major`, `minor`, `locationName`, `lat`, `lng`, `area`, `status` (`active`|`inactive`|`maintenance`), `adId`.
