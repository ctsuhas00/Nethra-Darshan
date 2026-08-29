# Nethra Darshan — Website (Laasya Vilaasa interface, reskinned)

This is the Laasya Vilaasa design/interface — same layout, CSS, animations,
and JS behavior — reskinned with Nethra Darshan's real content. No interface,
class name, or JS logic was changed; only text, links, and image labels.

## What changed vs. the original Laasya Vilaasa files
- Brand, meta tags, schema.org block → Nethra Darshan, Pavoor, Mangalore
- Hero, intro, amenities, experience, location, footer copy → Nethra Darshan's
  actual property description (villa, sky pool, sky bar, farm)
- The three "apartment" showcase cards → Nethra Darshan's three bedrooms
  (Master / Second / Third), since it's one villa, not three separate units
- Reviews section → honest "no reviews yet" copy per platform (Airbnb,
  Booking.com, Agoda) — the Laasya ratings/review quotes were real data for
  that property and were not reused here, since they'd be fabricated for
  Nethra Darshan
- Gallery labels → Nethra Darshan shot list (bedrooms, living room, sky pool,
  sky bar, farm)
- `main.js` booking config (`accommodations` / `propertyPlatforms`) → Nethra
  Darshan's real Airbnb / Booking.com / Agoda links. Each bedroom choice in
  the booking modal leads to the same three platforms, since it's a single
  villa listing rather than per-room listings
- `style.css` — unchanged, exactly as uploaded

## Booking links used
- Airbnb: https://www.airbnb.co.in/rooms/1304811251269428394
- Booking.com: https://www.booking.com/hotel/in/nethra-darshan.html
- Agoda: https://www.agoda.com/nethra-darshan/hotel/mangalore-in.html

## Images
All photo slots are still labeled placeholders (`.ph` / `.ph--fill` /
`.ph--zoom`), each carrying the real shot it should become — swap each
`<div>` for an `<img>` in place, same as the original Laasya build's README
described.