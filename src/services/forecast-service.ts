import { DemoForecastProvider } from "@/providers/demo/demo-forecast-provider";
import type { CanonicalLocation } from "@/domain/location/types";

const forecastProvider = new DemoForecastProvider();
export const getForecastForLocation = (location: CanonicalLocation) => forecastProvider.getForecast(location);
