import { z } from "zod";

// Xilog Data Logger
export const SelectLoggerChannel = z.object({
  index: z.string(),
  readingType: z.string(),
  dataType: z.number(),
  UnitType: z.number(),
});

export const SelectLoggerDetails = z.object({
  serial: z.number(),
  name: z.string(),
  channels: z.array(SelectLoggerChannel),
  location: z.object({
    latitude: z.number(),
    longitude: z.number(),
  }),
});

export const SelectLoggersListData = z.array(SelectLoggerDetails);

export const SelectLoggerEntry = z.object({
  timestamp: z.string(),
  value: z.number(),
});

export const SelectLoggerChannelEntry = z.object({
  channel: SelectLoggerChannel,
  data: z.array(SelectLoggerEntry),
});

export const LoggerFilterBody = z.object({
  serialNumber: z.string(),
  channel: z.string(),
  startDateTime: z.string(),
  endDateTime: z.string(),
});

export const LatestLoggerEntryFilterSchema = z.object({
  serialNumber: z.string(),
  channel: z.string(),
});

// Multilog Data Logger
export const MultilogUnitChildren = z.object({
  symbols: z
    .union([
      z.object({
        content: z.string(),
      }),
      z.object({}),
    ])
    .optional(),
});

export const MultilogMeasurementChildren = z.object({
  name: z
    .union([
      z.object({
        content: z.string(),
      }),
      z.object({}),
    ])
    .optional(),
  reference: z
    .union([
      z.object({
        content: z.string(),
      }),
      z.object({}),
    ])
    .optional(),
  units: z.object({
    children: z.array(MultilogUnitChildren),
  }),
});

export const MultilogChannelChildren = z.object({
  channelName: z
    .union([
      z.object({
        content: z.string(),
      }),
      z.object({}),
    ])
    .optional(),
  offset: z
    .union([
      z.object({
        content: z.string(),
      }),
      z.object({}),
    ])
    .optional(),
  flowPulseFactor: z
    .union([
      z.object({
        content: z.string(),
      }),
      z.object({}),
    ])
    .optional(),
  meterReadValue: z
    .union([
      z.object({
        content: z.string(),
      }),
      z.object({}),
    ])
    .optional(),
  meterReadDate: z
    .union([
      z.object({
        content: z.string(),
      }),
      z.object({}),
    ])
    .optional(),
  calvalue: z
    .union([
      z.object({
        content: z.string(),
      }),
      z.object({}),
    ])
    .optional(),
  loggercalvalue: z
    .union([
      z.object({
        content: z.string(),
      }),
      z.object({}),
    ])
    .optional(),
  loggeroffset: z
    .union([
      z.object({
        content: z.string(),
      }),
      z.object({}),
    ])
    .optional(),
  ignoreloggervalues: z
    .union([
      z.object({
        content: z.string(),
      }),
      z.object({}),
    ])
    .optional(),
  is4to20: z
    .union([
      z.object({
        content: z.string(),
      }),
      z.object({}),
    ])
    .optional(),
  loggerIs4to20: z
    .union([
      z.object({
        content: z.string(),
      }),
      z.object({}),
    ])
    .optional(),
  invertnegativevalues: z
    .union([
      z.object({
        content: z.string(),
      }),
      z.object({}),
    ])
    .optional(),
  lastValue: z
    .union([
      z.object({
        content: z.string(),
      }),
      z.object({}),
    ])
    .optional(),
  lastValueDate: z
    .union([
      z.object({
        content: z.string(),
      }),
      z.object({}),
    ])
    .optional(),
  measurement: z.object({
    id: z.string(),
    children: z.array(MultilogMeasurementChildren),
  }),
});

export const MultilogLoggerChannel = z.object({
  channel: z.object({
    number: z.string(),
    children: z.array(MultilogChannelChildren),
  }),
});

// export const MultilogLoggerDetails = z.object({
//   loggerid: z.string(),
//   mobileNumber: z.string(),
//   dateLastMessageReceived: z.string(),
//   type: z.string(),
//   serialNumber: z.string(),
//   loggerOwner: z.string(),
//   LogRate: z.string(),
//   RST: z.string(),
//   RET: z.string(),
//   gsmDataNumber: z.string(),
//   notes: z.string(),
//   batteryCondition: z.string(),
//   signalStrength: z.string(),
//   lastReportedVersion: z.string(),
//   dateCreated: z.string(),
//   dateUpdated: z.string(),
//   heightAOD: z.string(),
//   startDate: z.string(),
//   endDate: z.string(),
//   maintenanceflag: z.string(),
//   id: z.string(),
//   owner: z.string(),
//   siteId: z.string(),
//   siteName: z.string(),
//   SiteNotes: z.string(),
//   latitude: z.string(),
//   longitude: z.string(),
//   channel1Type: z.string(),
//   flowPulseFactor1: z.string(),
//   meterRead1Value: z.string(),
//   meterRead1Date: z.string(),
//   channel2Type: z.string(),
//   flowPulseFactor2: z.string(),
//   meterRead2Value: z.string(),
//   meterRead2Date: z.string(),
//   channels: z.object({
//     channel: z.array(MultilogLoggerChannel),
//   }),
// });

export const MultilogSummaryChildren = z.object({
  summary: z.object({
    APIVersion: z
      .union([
        z.object({
          content: z.string(),
        }),
        z.object({}),
      ])
      .optional(),
    accountID: z
      .union([
        z.object({
          content: z.string(),
        }),
        z.object({}),
      ])
      .optional(),
    accountName: z
      .union([
        z.object({
          content: z.string(),
        }),
        z.object({}),
      ])
      .optional(),
    accountOwnerId: z
      .union([
        z.object({
          content: z.string(),
        }),
        z.object({}),
      ])
      .optional(),
    accountHighestMessage: z
      .union([
        z.object({
          content: z.string(),
        }),
        z.object({}),
      ])
      .optional(),
    accountUpdateTime: z
      .union([
        z.object({
          content: z.string(),
        }),
        z.object({}),
      ])
      .optional(),
    accountNumLoggers: z
      .union([
        z.object({
          content: z.string(),
        }),
        z.object({}),
      ])
      .optional(),
    CentreLongitude: z
      .union([
        z.object({
          content: z.string(),
        }),
        z.object({}),
      ])
      .optional(),
    CentreLatitude: z
      .union([
        z.object({
          content: z.string(),
        }),
        z.object({}),
      ])
      .optional(),
    MinimumPhoto: z
      .union([
        z.object({
          content: z.string(),
        }),
        z.object({}),
      ])
      .optional(),
  }),
});

export const MultilogLoggerChildren = z.object({
  logger: z.object({
    loggerid: z
      .union([
        z.object({
          content: z.string(),
        }),
        z.object({}),
      ])
      .optional(),
    mobileNumber: z
      .union([
        z.object({
          content: z.string(),
        }),
        z.object({}),
      ])
      .optional(),
    dateLastMessageReceived: z
      .union([
        z.object({
          content: z.string(),
        }),
        z.object({}),
      ])
      .optional(),
    type: z
      .union([
        z.object({
          content: z.string(),
        }),
        z.object({}),
      ])
      .optional(),
    serialNumber: z
      .union([
        z.object({
          content: z.string(),
        }),
        z.object({}),
      ])
      .optional(),
    loggerOwner: z
      .union([
        z.object({
          content: z.string(),
        }),
        z.object({}),
      ])
      .optional(),
    LogRate: z
      .union([
        z.object({
          content: z.string(),
        }),
        z.object({}),
      ])
      .optional(),
    RST: z
      .union([
        z.object({
          content: z.string(),
        }),
        z.object({}),
      ])
      .optional(),
    RET: z
      .union([
        z.object({
          content: z.string(),
        }),
        z.object({}),
      ])
      .optional(),
    gsmDataNumber: z
      .union([
        z.object({
          content: z.string(),
        }),
        z.object({}),
      ])
      .optional(),
    notes: z
      .union([
        z.object({
          content: z.string(),
        }),
        z.object({}),
      ])
      .optional(),
    batteryCondition: z
      .union([
        z.object({
          content: z.string(),
        }),
        z.object({}),
      ])
      .optional(),
    signalStrength: z
      .union([
        z.object({
          content: z.string(),
        }),
        z.object({}),
      ])
      .optional(),
    lastReportedVersion: z
      .union([
        z.object({
          content: z.string(),
        }),
        z.object({}),
      ])
      .optional(),
    dateCreated: z
      .union([
        z.object({
          content: z.string(),
        }),
        z.object({}),
      ])
      .optional(),
    dateUpdated: z
      .union([
        z.object({
          content: z.string(),
        }),
        z.object({}),
      ])
      .optional(),
    heightAOD: z
      .union([
        z.object({
          content: z.string(),
        }),
        z.object({}),
      ])
      .optional(),
    startDate: z
      .union([
        z.object({
          content: z.string(),
        }),
        z.object({}),
      ])
      .optional(),
    endDate: z
      .union([
        z.object({
          content: z.string(),
        }),
        z.object({}),
      ])
      .optional(),
    maintenanceflag: z
      .union([
        z.object({
          content: z.string(),
        }),
        z.object({}),
      ])
      .optional(),
    id: z
      .union([
        z.object({
          content: z.string(),
        }),
        z.object({}),
      ])
      .optional(),
    owner: z
      .union([
        z.object({
          content: z.string(),
        }),
        z.object({}),
      ])
      .optional(),
    siteId: z
      .union([
        z.object({
          content: z.string(),
        }),
        z.object({}),
      ])
      .optional(),
    siteName: z
      .union([
        z.object({
          content: z.string(),
        }),
        z.object({}),
      ])
      .optional(),
    SiteNotes: z
      .union([
        z.object({
          content: z.string(),
        }),
        z.object({}),
      ])
      .optional(),
    latitude: z
      .union([
        z.object({
          content: z.string(),
        }),
        z.object({}),
      ])
      .optional(),
    longitude: z
      .union([
        z.object({
          content: z.string(),
        }),
        z.object({}),
      ])
      .optional(),
    channel1Type: z
      .union([
        z.object({
          content: z.string(),
        }),
        z.object({}),
      ])
      .optional(),
    flowPulseFactor1: z
      .union([
        z.object({
          content: z.string(),
        }),
        z.object({}),
      ])
      .optional(),
    meterRead1Value: z
      .union([
        z.object({
          content: z.string(),
        }),
        z.object({}),
      ])
      .optional(),
    meterRead1Date: z
      .union([
        z.object({
          content: z.string(),
        }),
        z.object({}),
      ])
      .optional(),
    channel2Type: z
      .union([
        z.object({
          content: z.string(),
        }),
        z.object({}),
      ])
      .optional(),
    flowPulseFactor2: z
      .union([
        z.object({
          content: z.string(),
        }),
        z.object({}),
      ])
      .optional(),
    meterRead2Value: z
      .union([
        z.object({
          content: z.string(),
        }),
        z.object({}),
      ])
      .optional(),
    meterRead2Date: z
      .union([
        z.object({
          content: z.string(),
        }),
        z.object({}),
      ])
      .optional(),
    channels: z.object({
      children: z.array(MultilogLoggerChannel),
    }),
  }),
});

export const SelectMultilogBody = z.object({
  loggers: z.object({
    children: z.array(
      z.union([
        z.object({
          summary: z.object({
            children: z.array(MultilogSummaryChildren),
          }),
        }),
        z.object({
          summary: z.object({
            children: z.array(MultilogLoggerChildren),
          }),
        }),
      ]),
    ),
  }),
});
