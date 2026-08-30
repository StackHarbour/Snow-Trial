import { DemoLocationProvider } from "@/providers/demo/demo-location-provider";

const locationProvider = new DemoLocationProvider();
export const resolveLocation = (query: string) => locationProvider.search(query);
export const getLocationBySlug = (slug: string) => locationProvider.getBySlug(slug);
