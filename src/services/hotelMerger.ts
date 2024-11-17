import { HotelResponse } from "../models/hotelCollection";

export function hotelMergerService(hotelList: HotelResponse[]) {
  const hotelMap = new Map<string, HotelResponse>();

  for (const hotel of hotelList) {
    if (hotelMap.has(hotel.id)) {
      // do merge
      const pHotel = hotelMap.get(hotel.id);

      if (pHotel !== undefined) {
        // location
        if (pHotel.location.lat === 0) {
          pHotel.location.lat = hotel.location.lat;
        }
        if (pHotel.location.lng === 0) {
          pHotel.location.lng = hotel.location.lng;
        }
        if (pHotel.location.city === "") {
          pHotel.location.city = hotel.location.city;
        }
        if (pHotel.location.country.length < hotel.location.country.length) {
          pHotel.location.country = hotel.location.country;
        }
        if (pHotel.location.address.length < hotel.location.address.length) {
          // choose the longer address version
          pHotel.location.address = hotel.location.address;
        }

        // description, choose the longer description version.
        if (pHotel.description.length < hotel.description.length) {
          pHotel.description = hotel.description;
        }

        // amenities
        const mergedGeneral = [
          ...pHotel.amenities.general,
          ...hotel.amenities.general,
        ].map((w) => w.toLowerCase());
        const mergedRoom = [
          ...pHotel.amenities.room,
          ...hotel.amenities.room,
        ].map((w) => w.toLowerCase());

        pHotel.amenities.general = [...new Set(mergedGeneral)];
        pHotel.amenities.room = [...new Set(mergedRoom)];

        // images
        pHotel.images.room = [...pHotel.images.room, ...hotel.images.room];
        pHotel.images.site = [...pHotel.images.site, ...hotel.images.site];
        pHotel.images.amenities = [
          ...pHotel.images.amenities,
          ...hotel.images.amenities,
        ];

        pHotel.booking_conditions = [
          ...pHotel.booking_conditions,
          ...hotel.booking_conditions,
        ];

        hotelMap.set(pHotel.id, pHotel);
      }
    } else {
      // add to Map
      hotelMap.set(hotel.id, hotel);
    }
  }

  // console.log(hotelMap);
  return hotelMap;
}
