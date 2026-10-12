import type { Metadata } from "next";
import { ExternalLink, Siren } from "lucide-react";

import { PageIntro } from "@/components/public/page-intro";

export const metadata: Metadata = { title: "Civic Resources", description: "Official local-government, public-service, and nonpartisan voting resources." };

const resourceGroups = [
  {
    title: "City government and meetings",
    resources: [
      { title: "City of Hot Springs", description: "Official City website for services, departments, notices, and public information.", href: "https://www.hotspringsar.gov/", source: "Official City source" },
      { title: "Board of Directors", description: "Official information about the Board, its members, districts, and meeting schedule.", href: "https://www.hotspringsar.gov/223/Board-of-Directors", source: "Official City source" },
      { title: "City meeting portal", description: "Agendas, meeting documents, minutes, and other official meeting records.", href: "https://cityhs.civicweb.net/Portal/", source: "Official City source" },
      { title: "City contacts", description: "Contact information for City departments, the Board, and public-service hotlines.", href: "https://www.hotspringsar.gov/264/Contact", source: "Official City source" },
      { title: "OpenHotSprings", description: "An independent tool for exploring public meeting records and civic information. Verify official actions against the linked government source documents.", href: "https://openhotsprings.com/", source: "Independent civic tool" },
    ],
  },
  {
    title: "Report an issue and public safety",
    resources: [
      { title: "Report a City issue", description: "Use the City's SeeClickFix service for non-emergency issues and to follow their progress.", href: "https://www.hotspringsar.gov/SCF", source: "Official City source" },
      { title: "Neighborhood Services", description: "Information about substandard housing, vacant structures, overgrown lots, abandoned vehicles, and graffiti.", href: "https://www.hotspringsar.gov/559/Neighborhood-Services", source: "Official City source" },
      { title: "Animal Services", description: "City information about animal services, shelter services, and animal-related concerns.", href: "https://www.hotspringsar.gov/126/Animal-Services", source: "Official City source" },
      { title: "Hot Springs Police", description: "Police department information and non-emergency resources. Call 911 for an emergency.", href: "https://www.hotspringsar.gov/359/Police", source: "Official City source" },
      { title: "Hot Springs Fire", description: "Fire department information and fire-safety resources. Call 911 for an emergency.", href: "https://www.hotspringsar.gov/167/Fire", source: "Official City source" },
    ],
  },
  {
    title: "Garland County government",
    resources: [
      { title: "Garland County government", description: "Official information about county government, elected officials, and public services.", href: "https://www.garlandcounty.org/27/Government", source: "Official County source" },
      { title: "Garland County departments", description: "Directory of county departments and services.", href: "https://www.garlandcounty.org/31/Departments", source: "Official County source" },
      { title: "Quorum Court", description: "Official overview of the Garland County Quorum Court and its members.", href: "https://www.garlandcounty.org/243/Quorum-Court", source: "Official County source" },
      { title: "Quorum Court agendas and minutes", description: "Meeting agendas, packets, minutes, and notices from the County's official archive.", href: "https://www.garlandcounty.org/AgendaCenter/Quorum-Court-2/", source: "Official County source" },
    ],
  },
  {
    title: "Housing and community support",
    resources: [
      { title: "Community Resource Center", description: "City information connecting residents with housing, employment, education, and health services.", href: "https://www.hotspringsar.gov/1861/Community-Resource-Center", source: "Official City source" },
      { title: "Housing Authority of Hot Springs", description: "Official information about local housing programs and Housing Authority services.", href: "https://www.hotspringsar.gov/207/15911/Housing-Authority-of-Hot-Springs", source: "Official City source" },
      { title: "Community Development", description: "City information about neighborhood improvement and community-development programs.", href: "https://www.hotspringsar.gov/563/Community-Development", source: "Official City source" },
    ],
  },
  {
    title: "Voting and elections",
    resources: [
      { title: "Garland County voter services", description: "Local voter registration, election, polling, and absentee-voting information.", href: "https://www.garlandcounty.org/218/Voter", source: "Official County source" },
      { title: "Arkansas voter information", description: "Nonpartisan state information about registration, elections, absentee voting, and voter services.", href: "https://www.sos.arkansas.gov/elections/voter-information", source: "Official State source" },
    ],
  },
  {
    title: "Business resources",
    resources: [
      { title: "Operating a business in Hot Springs", description: "City guidance and links for licenses, permits, taxes, and other local business requirements.", href: "https://www.hotspringsar.gov/152/5517/Operating-a-Business-in-Hot-Springs", source: "Official City source" },
      { title: "Greater Hot Springs Chamber of Commerce", description: "Local business programs, networking, and community information from the area chamber.", href: "https://www.hotspringschamber.com/", source: "Community organization" },
    ],
  },
] as const;

export default function ResourcesPage() {
  return (
    <>
      <PageIntro eyebrow="Civic resources" title="Find the official source faster."><p>This directory prioritizes government sources and nonpartisan civic information. Links open on the organization’s own website.</p></PageIntro>
      <section className="bg-white py-16 sm:py-20">
        <div className="mx-auto max-w-5xl px-5 sm:px-8">
          <div className="flex items-start gap-4 rounded-2xl border border-red-900/15 bg-red-50 p-5 text-sm leading-6 text-navy-800">
            <Siren aria-hidden="true" className="mt-0.5 size-5 shrink-0 text-red-700" />
            <p><strong className="text-navy-950">For emergencies, call 911.</strong> The public-safety links below are provided for information and non-emergency needs.</p>
          </div>
          <div className="mt-12 space-y-14">
            {resourceGroups.map((group) => (
              <section key={group.title} aria-labelledby={`resource-${group.title.toLowerCase().replaceAll(" ", "-")}`}>
                <h2 id={`resource-${group.title.toLowerCase().replaceAll(" ", "-")}`} className="font-display text-3xl font-semibold text-navy-950 sm:text-4xl">{group.title}</h2>
                <div className="mt-6 grid gap-5 sm:grid-cols-2">
                  {group.resources.map((resource) => (
                    <a key={resource.href} href={resource.href} target="_blank" rel="noreferrer" className="group rounded-3xl border border-navy-900/10 bg-warm-50 p-7 outline-none transition hover:border-blue-700/35 hover:shadow-lg focus-visible:ring-2 focus-visible:ring-blue-600">
                      <p className="text-xs font-bold uppercase tracking-[0.14em] text-blue-700">{resource.source}</p>
                      <h3 className="mt-3 flex items-start justify-between gap-4 text-xl font-bold text-navy-950">{resource.title}<ExternalLink aria-hidden="true" className="mt-1 size-4 shrink-0 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" /></h3>
                      <p className="mt-3 text-sm leading-6 text-navy-700">{resource.description}</p>
                    </a>
                  ))}
                </div>
              </section>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
