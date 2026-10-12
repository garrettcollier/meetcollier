export const engagementConfig = {
  officeHours: {
    cadence: "Second and fourth Saturdays",
    startTime: "10:00 a.m.",
    endTime: "12:00 p.m.",
    timezone: "Central Time",
    venueName: "San Francisco Bread Co",
    venueAddress: "261 Cornerstone Blvd, Hot Springs, AR 71913",
    venueMapUrl:
      "https://www.google.com/maps/search/?api=1&query=San+Francisco+Bread+Co+261+Cornerstone+Blvd+Hot+Springs+AR+71913",
    venueWebsiteUrl: "https://www.sanfranbreadco.com/",
  },
  townHall: {
    cadence: "Second Thursday of each month",
    startTime: "6:00 p.m.",
    timezone: "Central Time",
    venue: "Venue to be confirmed",
  },
  responseStandard: {
    acknowledgmentWindow: "within two business days",
  },
} as const;
