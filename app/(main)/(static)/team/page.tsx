import Link from "next/link";

export const metadata = {
  title: "Team | Annotation Tool",
  description:"Meet the dedicated team behind the Sesame Street Archive.",
};

export default function TeamPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <header className="mb-10">
        <h1 className="text-4xl font-bold mb-2">Meet the <em>Sesame Street</em> Archive Team</h1>
        <p className="text-lg text-neutral-600">
          We are a group of passionate individuals dedicated to preserving the legacy of Sesame Street through research and technology.
        </p>
      </header>
      <main>
        <h2 className="text-2xl font-semibold mb-2">Team</h2>
        <div>
          <h3 className="text-xl font-semibold mb-2">Founding Leadership</h3>
          <section className="grid sm:grid-cols-2 md:grid-cols-3 gap-8 mb-8">
            <p>
              Sophia Vinci-Booher <br />
              Principal Investigator
            </p>
            <p>
              James Booth <br />
              Co-Investigator
            </p>
            <p>
              Kendrick Kay <br />
              Co-Investigator
            </p>
            <p>
              Chen Yu <br />
              Co-Investigator
            </p>
            <p>
              Franco Pestilli <br />
              Co-Investigator
            </p>
            <p>
              Karol Sadkowski <br />
              Technical Project Manager
            </p>
          </section>
        </div>
        <div className="separator"></div>
        <div className="block-format">
          <h3 className="text-xl font-semibold mb-2">Technical Contributors</h3>
           <section className="grid sm:grid-cols-2 md:grid-cols-3 gap-8 mb-8">
            <p>
              Jasmine Guo <br />
              Data Scientist
            </p>
          </section>
        </div>
        <div className="separator"></div>
        <div className="block-format">
          <h3 className="text-xl font-semibold mb-2">Website Development</h3>
           <section className="grid sm:grid-cols-2 md:grid-cols-3 gap-8 mb-8">
            <p>
              Andrew Wesolek <br />
              Co-Investigator
            </p>
            <p>
              Cazembe Kennedy <br />
              HCI Specialist
            </p>
            <p>
              Anthony Cooper <br />
              Solutions Developer
            </p>
            <p>
              Erin Geier <br />
              Full-Stack Cloud Engineer
            </p>
          </section>
        </div>
        <div className="separator"></div>
        <div className="block-format">
          <h3 className="text-xl font-semibold mb-2">Research Assistants</h3>
           <section className="grid sm:grid-cols-2 md:grid-cols-3 gap-8 mb-8">
            <p>
              Aiste Austrevicius <br />
              Research Assistant
            </p>
            <p>
              Angela Qian <br />
              Research Assistant
            </p>
            <p>
              Bevin Zhang <br />
              Research Assistant
            </p>
            <p>
              Chi Luo <br />
              Research Assistant
            </p>
            <p>
              Eva Maria Louis <br />
              Research Assistant
            </p>
            <p>
              Kaya Booth <br />
              Research Assistant
            </p>
            <p>
              Rithika Thambireddy <br />
              Research Assistant
            </p>
            <p>
              Xizhi Li <br />
              Research Assistant
            </p>
            <p>
              Yimeng Gu <br />
              Research Assistant
            </p>
            <p>
              Yumiko Wang <br />
              Research Assistant
            </p>
          </section>
        </div>
      </main>
    </div>
  );
}