import "./About.css";
import "@aws-amplify/ui-react/styles.css";
import useScrollToTop from "../ScrollToTop";

function Team() {
  useScrollToTop();
  return (
    <div>
      <div className="separator"></div>
      <div className="separator"></div>
      <div className="separator"></div>
      <div className="separator"></div>

      <header className="banner1"></header>

      <div className="separator"></div>
      <main>
        <h1 className="intro">
          <i>Sesame Street</i>Archive{" "}
        </h1>
        <div className="block-format">
          <h2>Team</h2>
          <h3>Founding Leadership</h3>
          <section>
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
          <h3>Technical Contributors</h3>
          <section>
            <p>
              Jasmine Guo <br />
              Data Scientist
            </p>
          </section>
        </div>
        <div className="separator"></div>
        <div className="block-format">
          <h3>Website Development</h3>
          <section>
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
              Cloud Engineer and Developer
            </p>
          </section>
        </div>
        <div className="separator"></div>
        <div className="block-format">
          <h3>Research Assistants</h3>
          <section>
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

        <div className="separator"></div>
        <p className="block-format"></p>
        <div className="separator"></div>
        <p className="block-format"></p>
        <div className="separator"></div>
        <p className="block-format"></p>
        <div className="separator"></div>
      </main>
    </div>
  );
}

export default Team;
