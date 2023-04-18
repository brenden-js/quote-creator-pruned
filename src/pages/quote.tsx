import PlusIcon from "../components/icons/plus";
import {useState, useEffect} from "react";
import dayjs from "dayjs";
import {api} from "~/utils/api";
import {useRouter} from "next/router";
import dynamicQuoteGenerator, {type AllRegionData, type RegionData, allCachedRegionData} from "../utils/quote-gen";
import Nav from "../components/nav";
import type {
  ServiceType,
  ConfigType
} from '@prisma/client'
import Image from "next/image";


type Day = number | null

export type QuoteData = {
  stAddress: string,
  city: string,
  zipCode: string,
  region: keyof AllRegionData,
  serviceType: ServiceType,
  configType: ConfigType,
  sqft: string,
  name: string,
  email: string,
  phone: string,
  requestedTimes: Array<string>
}

const Quote = () => {
  const [selectedTimes, setSelectedTimes] = useState<Array<string>>([]);
  const [quoteData, setQuoteData] = useState<QuoteData>(
    {
      stAddress: '',
      city: '',
      zipCode: '',
      serviceType: 'none',
      configType: 'none',
      sqft: '',
      region: 'none',
      name: '',
      email: '',
      phone: '',
      requestedTimes: selectedTimes
    }
  );

  const [dayCursor, setDayCursor] = useState<number>(4);

  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const days: Day[] = [...Array(dayCursor)].map((day, idx) => {
    const now = new Date();
    // we do not accept next day appointments after 1pm, so do not show this as an option
    if (idx === 0 && (now.getHours() > 13)) {
      return null
    }
    return new Date().setDate(new Date().getDate() + idx + 1)
  })

  const [viewingTime, setViewingTime] = useState(dayjs(days[0]).format('MM/DD'))

  const handleTimeCardClick = (isoTime: string) => setSelectedTimes((prev: string[]) => {
    // if the time already exists, then remove it
    console.log('CURR ISO STATE', prev)
    if (selectedTimes.includes(isoTime)) {
      return prev.filter((prevTime) => prevTime !== isoTime)
    }
    return [...prev, isoTime]
  });

  const router = useRouter();

  const sendQuote = api.house.createQuote.useMutation({
    async onSuccess(obj) {
      console.log("ON SUCCESS", obj)
      await router.push(`/house/${obj.id}`)
    }
  });

  const [width, setWidth] = useState<number | undefined>(undefined);


  useEffect(() => {
    if (typeof window !== "undefined") {
      function handleWindowSizeChange() {
        setWidth(window.innerWidth);
      }


      // browser code
      window.addEventListener('resize', handleWindowSizeChange);
      return () => {
        window.removeEventListener('resize', handleWindowSizeChange);
      }
    }
  }, [width]);

  const handleSendQuote = () => {
    sendQuote.mutate(quoteData);
  }

  return (
    <>
      <Nav />
      {/*to add snapping back add this to the classname-> md:snap-y md:snap-mandatory max-h-screen overflow-scroll*/}
      <main>
        <div className="flex flex-col ">
          {/*ENTRY*/}
          <div className="flex shrink-0 snap-center snap-always flex-col items-center justify-center py-44">
            <h1 className="w-4/5 p-4 text-center text-4xl font-bold md:text-6xl lg:w-3/5 xl:w-2/5">
              Let&apos;s order your service.
            </h1>
            <div className="pt-2">
              <p className="text-xl font-semibold text-gray-700">
                Start by entering details below.
              </p>
            </div>
            <div className="mt-12 italic">Scroll down to continue</div>
            <Image
              className="mt-3"
              src={"/icons/scroll-down-chevron.svg"}
              alt={"scroll down arrow"}
              width={50}
              height={16}
            />
          </div>
          {/* SERVICE AREA */}
          <div
            className={
              "flex shrink-0 flex-grow snap-center snap-always flex-col items-center justify-center bg-gray-50 py-44"
            }
          >
            <div className="flex flex-col">
              <div className="mb-8 flex flex-col items-center md:block">
                <h2 className="mb-1.5 text-center text-3xl font-semibold md:mb-0 md:inline-block md:text-left lg:text-3xl">
                  Service Area.
                </h2>
                <p className="ml-2 text-center text-2xl font-semibold text-gray-700 md:inline-block md:text-left md:text-3xl">
                  Where is your address located?
                </p>
              </div>
            </div>
            {/* SERVICE AREA OPTIONS */}
            <div className="flex w-4/5 flex-col lg:w-2/5">
              <div
                className={`mb-4 flex w-full cursor-pointer items-center justify-between rounded-lg border ${
                  quoteData.region === 'NLA'
                    ? "border-blue-500 ring-1 ring-blue-500"
                    : "border-gray-300 hover:border-gray-400"
                } p-4 py-8 text-sm font-medium shadow-sm`}
                onClick={() => {
                  setQuoteData((prev) => {
                    return { ...prev, region: "NLA" };
                  });
                }}
              >
                <div className="w-1/2">
                  <p className="text-lg">North Los Angeles</p>
                </div>
                <p className="w-1/2 text-right text-gray-500">
                  Glendale, Pomona, Burbank, and more.
                </p>
              </div>
              <div
                className={`mb-4 flex w-full cursor-pointer items-center justify-between rounded-lg border ${
                  quoteData.region === "SLA"
                    ? "border-blue-500 ring-1 ring-blue-500"
                    : "border-gray-300 hover:border-gray-400"
                } p-4 py-8 text-sm font-medium shadow-sm  peer-checked:border-blue-500 peer-checked:ring-1 peer-checked:ring-blue-500`}
                onClick={() => {
                  setQuoteData((prev) => {
                    return { ...prev, region: "SLA" };
                  });
                }}
              >
                <div className="w-1/2">
                  <p className="text-lg">South Los Angeles</p>
                </div>
                <p className="w-1/2 text-right text-gray-500">
                  Long Beach, Malibu, Santa Monica, and more.
                </p>
              </div>
              <div
                className={`flex w-full cursor-pointer items-center justify-between rounded-lg border ${
                  quoteData.region === "OC"
                    ? "border-blue-500 ring-1 ring-blue-500"
                    : "border-gray-300 hover:border-gray-400"
                } p-4 py-8 text-sm font-medium shadow-sm  peer-checked:border-blue-500 peer-checked:ring-1 peer-checked:ring-blue-500`}
                onClick={() => {
                  setQuoteData((prev) => {
                    return { ...prev, region: "OC" };
                  });
                }}
              >
                <div className="w-1/2">
                  <p className="text-lg">Orange County</p>
                </div>
                <p className="w-1/2 text-right text-gray-500">
                  Anaheim, Irvine, San Clemente, and more.
                </p>
              </div>
            </div>
            <div
              className={`mt-12 italic ${
                quoteData.region !== "none" ? "text-gray-600" : "invisible"
              }`}
            >
              Scroll down to continue
            </div>
            <Image
              className={`mt-3 ${
                quoteData.region !== "none" ? " " : "invisible"
              }`}
              src={"/icons/scroll-down-chevron.svg"}
              alt={"scroll down arrow"}
              width={50}
              height={16}
            />
          </div>
          {/* SQFT SECTION */}
          {quoteData.region !== "none" ? (
            <div className="flex shrink-0 flex-grow snap-center snap-always flex-col items-center justify-center py-44">
              <div className="flex flex-col items-center justify-center">
                <div className="mb-8 flex flex-col md:block">
                  <h2 className="mb-1.5 text-center text-3xl font-semibold md:mb-0 md:inline-block md:text-left lg:text-3xl">
                    Square footage.
                  </h2>
                  <p className="ml-2 text-center text-2xl font-semibold text-gray-700 md:inline-block md:text-left md:text-3xl">
                    How big is the interior?
                  </p>
                </div>
              </div>
              <div className="flex w-1/2 items-center justify-center py-3">
                <div className="flex">
                  <input
                    className="w-full rounded-lg border border-gray-300 p-3 text-center text-xl hover:border-gray-400"
                    placeholder="Square footage"
                    type="number"
                    value={quoteData.sqft}
                    onChange={(e) =>
                      setQuoteData((prev) => {
                        return { ...prev, sqft: e.target.value };
                      })
                    }
                  />
                </div>
              </div>
              <div
                className={`mt-12 italic ${
                  quoteData.sqft.length >= 3 ? "text-gray-600" : "invisible"
                }`}
              >
                Scroll down to continue
              </div>
              <Image
                className={`mt-3 ${
                  quoteData.sqft.length >= 3 ? "" : "invisible"
                }`}
                src={"/icons/scroll-down-chevron.svg"}
                alt={"scroll down arrow"}
                width={50}
                height={16}
              />
            </div>
          ) : (
            <></>
          )}

          {/* SERVICE SECTION */}
          {quoteData.sqft.length >= 3 ? (
            <div className="flex shrink-0 flex-grow snap-center snap-always flex-col items-center justify-center bg-gray-50 py-44">
              <div className="flex flex-col">
                <div className="mb-8 flex flex-col md:block">
                  <h2 className="mb-1.5 text-center text-3xl font-semibold md:mb-0 md:inline-block md:text-left lg:text-3xl">
                    Service Type.
                  </h2>
                  <p className="ml-2 text-center text-2xl font-semibold text-gray-700 md:inline-block md:text-left md:text-3xl">
                    Which package is best?
                  </p>
                </div>
              </div>
              {/* SERVICE TYPE */}
              <div className={"flex w-4/5 flex-col lg:w-2/5"}>
                <div
                  className={`mb-4 flex cursor-pointer items-center justify-between rounded-lg border ${
                    quoteData.serviceType === "type_1"
                      ? "border-blue-500 ring-1 ring-blue-500"
                      : "border-gray-300 hover:border-gray-400"
                  } p-4 py-8 text-sm font-medium shadow-sm  peer-checked:border-blue-500 peer-checked:ring-1 peer-checked:ring-blue-500`}
                  onClick={() =>
                    setQuoteData((prev) => {
                      return { ...prev, serviceType: "type_1" };
                    })
                  }
                >
                  <div>
                    <p className="text-lg">Standard Service Package</p>
                    <p className="text-gray-500">
                      Contains everything you need.
                    </p>
                  </div>
                  <p className="ml-4 text-gray-900">
                    {dynamicQuoteGenerator(
                      allCachedRegionData[quoteData.region][
                        "type_1" as keyof RegionData
                      ],
                      parseInt(quoteData.sqft)
                    ).toLocaleString("en-US", {
                      style: "currency",
                      currency: "USD",
                    })}
                  </p>
                </div>
                <div
                  className={`col-span-2 mb-4 flex cursor-pointer items-center justify-between rounded-lg border lg:col-span-1 ${
                    quoteData.serviceType === "type_2"
                      ? "border-blue-500 ring-1 ring-blue-500"
                      : "border-gray-300 hover:border-gray-400"
                  } p-4 py-8 text-sm font-medium shadow-sm  peer-checked:border-blue-500 peer-checked:ring-1 peer-checked:ring-blue-500`}
                  onClick={() =>
                    setQuoteData((prev) => {
                      return { ...prev, serviceType: "type_2" };
                    })
                  }
                >
                  <div>
                    <p className="text-lg">Deluxe Service Package</p>
                    <p className="text-gray-500">
                      Contains even more valuable items.
                    </p>
                  </div>
                  <p className="ml-4 text-gray-900">
                    {dynamicQuoteGenerator(
                      allCachedRegionData[quoteData.region][
                        "type_2" as keyof RegionData
                      ],
                      parseInt(quoteData.sqft)
                    ).toLocaleString("en-US", {
                      style: "currency",
                      currency: "USD",
                    })}
                  </p>
                </div>
                <div className="flex cursor-pointer items-center justify-between rounded-lg border border-gray-300 bg-gray-200 p-4 py-8 text-sm font-medium shadow-sm hover:border-gray-400 peer-checked:border-blue-500 peer-checked:ring-1 peer-checked:ring-blue-500">
                  <p className="text-gray-700">What&apos;s included?</p>
                  <PlusIcon />
                </div>
              </div>

              <div
                className={`mt-12 italic ${
                  quoteData.serviceType !== "none"
                    ? "text-gray-600"
                    : "invisible"
                }`}
              >
                Scroll down to continue
              </div>
              <Image
                className={`mt-3 ${
                  quoteData.serviceType !== "none" ? "" : "invisible"
                }`}
                src={"/icons/scroll-down-chevron.svg"}
                alt={"scroll down arrow"}
                width={50}
                height={16}
              />
            </div>
          ) : (
            <></>
          )}
          {/* CONFIG SECTION */}
          {quoteData.serviceType !== "none" ? (
            <div className="flex shrink-0 snap-center snap-always flex-col items-center justify-center py-44">
              <div className="flex flex-col items-center justify-center">
                <div className="mb-8 flex flex-col md:block">
                  <h2 className="mb-1.5 text-center text-3xl font-semibold md:mb-0 md:inline-block md:text-left lg:text-3xl">
                    Customize service.
                  </h2>
                  <p className="ml-2 text-center text-2xl font-semibold text-gray-700 md:inline-block md:text-left md:text-3xl">
                    What works best?
                  </p>
                </div>
              </div>
              <div className="w-4/5 lg:w-2/5">
                <div
                  className={`mb-4 flex min-w-full cursor-pointer items-center justify-between rounded-lg border ${
                    quoteData.configType === "config_1"
                      ? "border-blue-500 ring-1 ring-blue-500"
                      : "border-gray-300 hover:border-gray-400"
                  } p-4 py-8 text-sm font-medium shadow-sm`}
                  onClick={() =>
                    setQuoteData((prev) => {
                      return { ...prev, configType: "config_1" };
                    })
                  }
                >
                  <div>
                    <p className="text-lg">Configuration 1</p>
                    <p className="text-gray-500">We will do it this way</p>
                  </div>
                  <p className="text-gray-900">Free</p>
                </div>
                <div
                  className={`mb-4 flex cursor-pointer items-center justify-between rounded-lg border ${
                    quoteData.configType === "config_2"
                      ? "border-blue-500 ring-1 ring-blue-500"
                      : "border-gray-300 hover:border-gray-400"
                  } p-4 py-8 text-sm font-medium shadow-sm `}
                  onClick={() =>
                    setQuoteData((prev) => {
                      return { ...prev, configType: "config_2" };
                    })
                  }
                >
                  <div>
                    <p className="text-lg">Configuration 2</p>
                    <p className="text-gray-500">We will do it another way</p>
                  </div>
                  <p className="text-gray-900">Free</p>
                </div>
                <div className="flex cursor-pointer items-center justify-between rounded-lg border border-gray-300 bg-gray-200 p-4 py-8 text-sm font-medium shadow-sm hover:border-gray-400 peer-checked:border-blue-500 peer-checked:ring-1 peer-checked:ring-blue-500">
                  <p className="text-gray-700">Not sure?</p>
                  <PlusIcon />
                </div>
              </div>
              <div
                className={`mt-12 italic ${
                  quoteData.configType ? "text-gray-600" : "invisible"
                }`}
              >
                Scroll down to continue
              </div>
              <Image
                className={`mt-3 ${quoteData.configType ? "" : "invisible"}`}
                src={"/icons/scroll-down-chevron.svg"}
                alt={"scroll down arrow"}
                width={50}
                height={16}
              />
            </div>
          ) : (
            <></>
          )}

          {/* ADDRESS */}
          {quoteData.configType !== 'none' ? (
            <div className="flex shrink-0 snap-center snap-always flex-col items-center justify-center bg-gray-50 py-44">
              <div className="flex flex-col items-center justify-center">
                <div className="mb-8 flex flex-col md:block">
                  <h2 className="mb-1.5 text-center text-3xl font-semibold md:mb-0 md:inline-block md:text-left lg:text-3xl">
                    Address.
                  </h2>
                  <p className="ml-2 text-center text-2xl font-semibold text-gray-700 md:inline-block md:text-left md:text-3xl">
                    Where will we deliver?
                  </p>
                </div>
              </div>
              <div className="w-4/5 lg:w-2/5">
                <input
                  className="mb-4 w-full rounded-lg border border-gray-300 p-3 text-lg hover:border-gray-400"
                  placeholder="Street Address"
                  type="text"
                  onChange={(e) =>
                    setQuoteData((prev) => {
                      return { ...prev, stAddress: e.target.value };
                    })
                  }
                />
                <input
                  className="mb-4 w-full rounded-lg border border-gray-300 p-3 text-lg hover:border-gray-400"
                  placeholder="City"
                  type="text"
                  onChange={(e) =>
                    setQuoteData((prev) => {
                      return { ...prev, city: e.target.value };
                    })
                  }
                />
                <input
                  className="w-full rounded-lg border border-gray-300 p-3 text-lg hover:border-gray-400"
                  placeholder="ZIP Code"
                  type="number"
                  value={quoteData.zipCode}
                  onChange={(e) =>
                    setQuoteData((prev) => {
                      return { ...prev, zipCode: e.target.value };
                    })
                  }
                />
              </div>

              <div
                className={`mt-12 italic ${
                  quoteData.stAddress && quoteData.city && quoteData.zipCode
                    ? "text-gray-600"
                    : "invisible"
                }`}
              >
                Scroll down to continue
              </div>
              <Image
                className={`mt-3 ${
                  quoteData.stAddress && quoteData.city && quoteData.zipCode
                    ? ""
                    : "invisible"
                }`}
                src={"/icons/scroll-down-chevron.svg"}
                alt={"scroll down arrow"}
                width={50}
                height={16}
              />
            </div>
          ) : (
            <></>
          )}
          {/* AVAILABILITY */}
          {quoteData.stAddress && quoteData.city && quoteData.zipCode ? (
            <div className="flex shrink-0 snap-center snap-always flex-col items-center justify-center px-2 py-44">
              <div className="flex flex-col items-center justify-center">
                <div className="mb-8 flex flex-col md:block">
                  <h2 className="mb-1.5 text-center text-3xl font-semibold md:mb-0 md:inline-block md:text-left lg:text-3xl">
                    Availability.
                  </h2>
                  <p className="ml-2 text-center text-2xl font-semibold text-gray-700 md:inline-block md:text-left md:text-3xl">
                    When works for you?
                  </p>
                </div>
              </div>
              <div className="w-4/5 xl:w-3/5">
                {days.map((_day) => {
                  if (_day === null) return <></>;
                  const day = new Date(_day);
                  return (
                    <div
                      key={_day}
                      onClick={() =>
                        setViewingTime(dayjs(_day).format("MM/DD"))
                      }
                      className={
                        "mb-4 cursor-pointer rounded-lg border border-gray-300 p-1 shadow-sm hover:border-gray-400 md:p-3"
                      }
                    >
                      <div className={`grid grid-cols-4 gap-4 p-1`}>
                        <div
                          className={`col-span-4 flex cursor-pointer items-center justify-between p-4 text-sm font-medium hover:border-gray-200 md:col-span-1 md:py-8`}
                        >
                          <div>
                            <h6 className="text-xl">
                              {dayjs(day).format("dddd")}
                            </h6>
                            <p>{dayjs(day).format("MM/DD")}</p>
                          </div>
                          <p>{">"}</p>
                        </div>
                        {/* TIME CARDS */}
                        {viewingTime === dayjs(_day).format("MM/DD") && (
                          <>
                            <div
                              onClick={() =>
                                handleTimeCardClick(
                                  dayjs(
                                    new Date(day.setHours(9, 0, 0))
                                  ).format()
                                )
                              }
                              className={`col-span-2 flex cursor-pointer flex-col items-center justify-center rounded-lg border md:col-span-1 ${
                                selectedTimes.includes(
                                  dayjs(
                                    new Date(day.setHours(9, 0, 0))
                                  ).format()
                                )
                                  ? "border-blue-500 ring-1 ring-blue-500"
                                  : "border-gray-300 hover:border-gray-400"
                              } p-2 py-2 text-sm font-medium shadow-sm md:p-4 md:py-8`}
                            >
                              <p className={"mb-1"}>Morning</p>
                              <div className={"flex flex-row"}>
                                <p>
                                  {dayjs(
                                    new Date(day.setHours(9, 0, 0))
                                  ).format("h[:]mmA")}
                                </p>
                                -
                                <p>
                                  {dayjs(
                                    new Date(day.setHours(10, 30, 0))
                                  ).format("h[:]mmA")}
                                </p>
                              </div>
                            </div>
                            <div
                              onClick={() =>
                                handleTimeCardClick(
                                  dayjs(
                                    new Date(day.setHours(11, 0, 0))
                                  ).format()
                                )
                              }
                              className={`col-span-2 flex cursor-pointer flex-col items-center justify-center rounded-lg border md:col-span-1 ${
                                selectedTimes.includes(
                                  dayjs(
                                    new Date(day.setHours(11, 0, 0))
                                  ).format()
                                )
                                  ? "border-blue-500 ring-1 ring-blue-500"
                                  : "border-gray-300 hover:border-gray-400"
                              } p-2 py-2 text-sm font-medium shadow-sm peer-checked:border-blue-500 md:p-4 md:py-8`}
                            >
                              <p className={"mb-1"}>Midday</p>
                              <div className={"flex flex-row items-center"}>
                                <p>
                                  {dayjs(
                                    new Date(day.setHours(11, 0, 0))
                                  ).format("h[:]mmA")}
                                </p>
                                -
                                <p>
                                  {dayjs(
                                    new Date(day.setHours(12, 30, 0))
                                  ).format("h[:]mmA")}
                                </p>
                              </div>
                            </div>
                            <div
                              onClick={() =>
                                handleTimeCardClick(
                                  dayjs(
                                    new Date(day.setHours(13, 0, 0))
                                  ).format()
                                )
                              }
                              className={`col-span-2 flex cursor-pointer flex-col items-center justify-center rounded-lg border md:col-span-1 ${
                                selectedTimes.includes(
                                  dayjs(
                                    new Date(day.setHours(13, 0, 0))
                                  ).format()
                                )
                                  ? "border-blue-500 ring-1 ring-blue-500"
                                  : "border-gray-300 hover:border-gray-400"
                              } p-2 py-2 text-sm font-medium shadow-sm peer-checked:border-blue-500 md:p-4 md:py-8`}
                            >
                              <p className={"mb-1"}>Afternoon</p>
                              <div
                                className={
                                  "flex flex-row items-center justify-center"
                                }
                              >
                                <p>
                                  {dayjs(
                                    new Date(day.setHours(13, 0, 0))
                                  ).format("h[:]mmA")}
                                </p>
                                -
                                <p>
                                  {dayjs(
                                    new Date(day.setHours(14, 30, 0))
                                  ).format("h[:]mmA")}
                                </p>
                              </div>
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
              <button
                className={
                  "bg-gray-25 mt-3 rounded-3xl border-2 border-gray-200 p-3 px-6 hover:border-gray-700"
                }
                onClick={() => setDayCursor((prev) => prev + 3)}
              >
                Show more times
              </button>
              <div
                className={`mt-12 italic ${
                  selectedTimes.length > 0 ? "text-gray-600" : "invisible"
                }`}
              >
                Scroll down to continue
              </div>
              <Image
                className={`mt-3 ${
                  selectedTimes.length > 0 ? "" : "invisible"
                }`}
                src={"/icons/scroll-down-chevron.svg"}
                alt={"scroll down arrow"}
                width={50}
                height={16}
              />
            </div>
          ) : (
            <></>
          )}
          {/* RECAP */}
          {quoteData.region &&
          quoteData.sqft &&
          quoteData.serviceType &&
          quoteData.configType &&
          quoteData.stAddress &&
          quoteData.city &&
          quoteData.zipCode ? (
            <div className="flex shrink-0 snap-center snap-always flex-col items-center justify-center bg-gray-50 py-44 md:flex-row">
              <div className="flex flex-col p-8 md:w-1/3">
                <h3 className="mb-2 inline-block text-center text-2xl font-semibold md:text-left lg:text-4xl">{`${quoteData.stAddress}, ${quoteData.city}.`}</h3>
                <p className="inline-block text-center text-2xl  font-semibold text-gray-500 md:text-left lg:text-4xl">
                  Your service awaits.
                </p>
              </div>
              <div className="flex flex-col text-center md:w-1/3 md:text-left">
                <div className="flex flex-col">
                  <h5 className="text-lg">
                    {quoteData.serviceType === "type_1"
                      ? "Package 1"
                      : "Package 2"}
                  </h5>
                  <p className="text-lg font-semibold">
                    {dynamicQuoteGenerator(
                      allCachedRegionData[quoteData.region][
                        quoteData.serviceType as keyof RegionData
                      ],
                      parseInt(quoteData.sqft)
                    ).toLocaleString("en-US", {
                      style: "currency",
                      currency: "USD",
                    })}
                  </p>
                  <p className="text-md text-gray-700">
                    {quoteData.configType === "config_1"
                      ? "Configuration 1 selected"
                      : "Configuration 2 selected"}
                  </p>
                  <h6 className=" mt-8 inline-block">Selected availability:</h6>
                  {selectedTimes.length > 0 ? (
                    <div className={"mt-1 text-sm font-semibold text-gray-700"}>
                      {selectedTimes.map((time) => {
                        return (
                          <div
                            key={time}
                            className={
                              "m-1 inline-block rounded-3xl border border-gray-500 p-2"
                            }
                          >
                            {dayjs(new Date(time)).format("ddd MM/DD h[:]mmA")}
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className={"mt-1 text-sm font-semibold text-gray-700"}>
                      <div
                        className={
                          "m-1 inline-block rounded-3xl border border-gray-500 p-2"
                        }
                      >
                        No times selected
                      </div>
                    </div>
                  )}
                  <h6 className="mt-2 inline-block text-lg font-semibold md:mt-8 lg:text-xl">
                    Order now, pay later
                  </h6>
                </div>
              </div>
              <div className="flex w-11/12 flex-col space-y-4 p-8 md:w-1/3">
                <div>
                  <input
                    className="w-full rounded-lg border border-gray-300 p-3 text-lg hover:border-gray-400"
                    placeholder="Name"
                    type="text"
                    onChange={(e) =>
                      setQuoteData((prev) => {
                        return { ...prev, name: e.target.value };
                      })
                    }
                  />
                </div>
                <div>
                  <input
                    className="w-full rounded-lg border border-gray-300 p-3 text-lg hover:border-gray-400"
                    placeholder="Email address"
                    type="email"
                    onChange={(e) =>
                      setQuoteData((prev) => {
                        return { ...prev, email: e.target.value };
                      })
                    }
                  />
                </div>
                <div>
                  <input
                    className="w-full rounded-lg border border-gray-300 p-3 text-lg hover:border-gray-400"
                    placeholder="Phone Number"
                    type="tel"
                    id="phone"
                    onChange={(e) =>
                      setQuoteData((prev) => {
                        return { ...prev, phone: e.target.value };
                      })
                    }
                  />
                </div>
                <button
                  className={`mt-8 rounded-md ${
                    sendQuote.isLoading ? "bg-gray-400" : "bg-indigo-600"
                  } px-3.5 py-4 text-base font-semibold leading-7 text-white shadow-sm ${
                    sendQuote.isLoading
                      ? "hover:bg-gray-400"
                      : "hover:bg-indigo-500"
                  } focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600`}
                  onClick={handleSendQuote}
                  disabled={sendQuote.isLoading || sendQuote.isError}
                >
                  Order My Service
                </button>
              </div>
            </div>
          ) : (
            <></>
          )}
          {/* FAQ */}
          <div className="flex shrink-0 snap-center snap-always flex-col items-center justify-center bg-black bg-opacity-90 py-44 md:flex-row">
            <h3 className="relative mb-8 p-4 text-4xl font-semibold text-white md:mb-16 md:block md:p-8">
              Frequently Asked Questions
            </h3>
            <div className="max-w-xl space-y-4">
              <details className="group [&_summary::-webkit-details-marker]:hidden">
                <summary className="flex cursor-pointer items-center justify-between rounded-lg bg-gray-900 p-4">
                  <h2 className="font-medium text-white">
                    What is this service and how does it work?
                  </h2>

                  <svg
                    className="ml-1.5 h-5 w-5 flex-shrink-0 transition duration-300 group-open:-rotate-180"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="white"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </summary>

                <p className="mt-4 px-4 leading-relaxed text-white">
                  This service provides benefits to you, through several
                  different ways.
                </p>
              </details>

              <details className="group [&_summary::-webkit-details-marker]:hidden">
                <summary className="flex cursor-pointer items-center justify-between rounded-lg bg-gray-900 p-4">
                  <h2 className="font-medium text-white">
                    How does this service differ from other services?
                  </h2>

                  <svg
                    className="ml-1.5 h-5 w-5 flex-shrink-0 transition duration-300 group-open:-rotate-180"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="white"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </summary>

                <p className="mt-4 px-4 leading-relaxed text-white">
                  This service beats out other services by being low cost, and
                  easy to use.
                </p>
              </details>

              <details className="group [&_summary::-webkit-details-marker]:hidden">
                <summary className="flex cursor-pointer items-center justify-between rounded-lg bg-gray-900 p-4">
                  <h2 className="font-medium text-white">
                    How long does this service take?
                  </h2>

                  <svg
                    className="ml-1.5 h-5 w-5 flex-shrink-0 transition duration-300 group-open:-rotate-180"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="white"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </summary>

                <p className="mt-4 px-4 leading-relaxed text-white">
                  It can range from 1 hour to 1 week, depending on the
                  configuration selected.
                </p>
              </details>

              <details className="group [&_summary::-webkit-details-marker]:hidden">
                <summary className="flex cursor-pointer items-center justify-between rounded-lg bg-gray-900 p-4">
                  <h2 className="font-medium text-white">
                    Will this service work in combination with other services?
                  </h2>

                  <svg
                    className="ml-1.5 h-5 w-5 flex-shrink-0 transition duration-300 group-open:-rotate-180"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="white"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </summary>

                <p className="mt-4 px-4 leading-relaxed text-white">
                  Yes, this service integrates easily with your existing
                  services.
                </p>
              </details>
            </div>
          </div>
          {/* MISSION */}
          <div className="flex shrink-0 snap-center snap-always items-center justify-center bg-gray-50 py-44">
            <div className="flex w-4/5 max-w-xl flex-col items-center">
              <h4 className="mb-4 text-center text-3xl font-semibold">
                Here to help you achieve your business goals, with our
                professional services.
              </h4>
              <p className="p-8 text-center text-2xl font-semibold">
                Helping you perform your core competencies; easier, faster, and
                more efficient than before.
              </p>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}

export default Quote;