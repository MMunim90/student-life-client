import React from "react";
import ThemeButton from "../../sharedItem/ThemeButton";
import { ImMail2 } from "react-icons/im";
import { BsWhatsapp } from "react-icons/bs";
import founder from "../../assets/founder.png";
import Navbar from "../../sharedItem/Navbar";

const classes = {
  section: "w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8",
  h2: "text-3xl sm:text-4xl font-bold tracking-tight",
};

const About = () => {
  return (
    <div className="bg-base-200">
      {/* Hero Section */}
      <section className="bg-base-100 border-b border-base-300 py-16 sm:py-20">
        <div className={classes.section}>
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl sm:text-5xl font-extrabold mb-4">
              About BrainBox
            </h1>
            <p className="text-lg text-base-content/80">
              BrainBox is your all-in-one student life toolkit, designed to
              simplify learning, boost productivity, and create a seamless
              campus experience.
            </p>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-12 sm:py-16">
        <div className={classes.section}>
          <div className="grid md:grid-cols-2 gap-10 items-center">
            <div>
              <h2 className={classes.h2}>Our Mission</h2>
              <p className="mt-4 text-base leading-7 text-base-content/80">
                Our mission is to empower students by reducing the stress of
                managing academics and daily life. We believe education should
                focus on meaningful learning and growth, not unnecessary
                struggles. BrainBox provides a digital platform for
                organization, collaboration, and personal growth.
              </p>
            </div>
            <div>
              <img
                data-aos="fade-left"
                data-aos-anchor="#example-anchor"
                data-aos-offset="500"
                data-aos-duration="2000"
                src="https://www.eschoolnews.com/files/2023/12/collaborative-learning.jpeg"
                alt="Students collaborating image"
                className="rounded-2xl shadow-md object-cover w-full h-72 animate-pulse"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="bg-base-100 py-12 sm:py-16 border-y border-base-300">
        <div className={classes.section}>
          <div className="max-w-3xl mx-auto text-center">
            <h2 className={classes.h2}>Our Story</h2>
            <p className="mt-4 text-base leading-7 text-base-content/80">
              BrainBox was born from a simple idea: make student life less
              overwhelming. As students, we faced the same struggles with
              deadlines, projects, and personal commitments. BrainBox was
              created to simplify those challenges, blending modern design with
              practical tools to support every student’s journey.
            </p>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-12 sm:py-16">
        <div className={classes.section}>
          <h2 className="text-center mb-24 text-3xl sm:text-4xl font-bold tracking-tight">
            Our Core Values
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div
              data-aos="zoom-in-up"
              data-aos-duration="1000"
              className="card bg-base-100 shadow-md border border-base-300 animate-pulse hover:shadow-2xl"
            >
              <div className="card-body">
                <h3 className="card-title">Simplicity</h3>
                <p>
                  We design tools that are intuitive and easy to use, helping
                  students stay focused on learning.
                </p>
              </div>
            </div>
            <div
              data-aos="zoom-in-up"
              data-aos-duration="2000"
              className="card bg-base-100 shadow-md border border-base-300 animate-pulse hover:shadow-2xl"
              style={{ animationDelay: "0.5s" }}
            >
              <div className="card-body">
                <h3 className="card-title">Collaboration</h3>
                <p>
                  We believe in the power of teamwork. BrainBox makes sharing,
                  connecting, and growing with peers effortless.
                </p>
              </div>
            </div>
            <div
              data-aos="zoom-in-up"
              data-aos-duration="3000"
              className="card bg-base-100 shadow-md border border-base-300 animate-pulse hover:shadow-2xl"
            >
              <div className="card-body">
                <h3 className="card-title">Innovation</h3>
                <p>
                  We constantly evolve to meet the changing needs of students
                  worldwide.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="bg-base-100 py-12 sm:py-16 border-t border-base-300">
        <div className={classes.section}>
          <h2 className="text-center mb-10 text-3xl sm:text-4xl font-bold tracking-tight">
            Meet the Team
          </h2>
          <div
            data-aos="zoom-out-up"
            className="grid sm:grid-cols-2 md:grid-cols-3 gap-8"
          >
            <div className="card bg-base-100 shadow-md border border-base-300">
              <div className="card-body items-center text-center">
                <div className="avatar">
                  <div className="w-24 rounded-full">
                    <img src={founder} alt="Founder" />
                  </div>
                </div>
                <h3 className="card-title mt-4">MMunim</h3>
                <p className="text-base-content/70">Founder & Lead Developer</p>
              </div>
            </div>
            {/* Add more team members here */}
          </div>
        </div>
      </section>

      {/* Sponsors Section */}
      <section className="py-12 sm:py-16">
        <div className={classes.section}>
          <h2 className="text-center mb-10 text-3xl sm:text-4xl font-bold tracking-tight">
            Sponsors
          </h2>
          <p className="text-center text-2xl">No Sponsors Found!</p>
          {/* <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-8 items-center">
            <img
              src="/images/sponsor1.png"
              alt="Sponsor 1"
              className="max-h-16 mx-auto"
            />
            <img
              src="/images/sponsor2.png"
              alt="Sponsor 2"
              className="max-h-16 mx-auto"
            />
            <img
              src="/images/sponsor3.png"
              alt="Sponsor 3"
              className="max-h-16 mx-auto"
            />
            <img
              src="/images/sponsor4.png"
              alt="Sponsor 4"
              className="max-h-16 mx-auto"
            />
          </div> */}
        </div>
      </section>

      {/* FAQ Section */}
      <section className="bg-base-100 py-12 sm:py-16 border-t border-base-300">
        <div className={classes.section}>
          <h2 className="text-center mb-10 text-3xl sm:text-4xl font-bold tracking-tight">
            Frequently Asked Questions
          </h2>
          <div className="max-w-3xl mx-auto space-y-4">
            <div
              data-aos="fade-right"
              data-aos-duration="2000"
              className="collapse collapse-arrow border border-base-300 bg-base-100"
            >
              <input type="checkbox" />
              <div className="collapse-title text-lg font-medium">
                What is BrainBox?
              </div>
              <div className="collapse-content text-base-content/80">
                <p>
                  BrainBox is a student life toolkit designed to help you stay
                  organized, collaborate easily, and boost productivity during
                  your academic journey.
                </p>
              </div>
            </div>

            <div
              data-aos="fade-left"
              data-aos-duration="4000"
              className="collapse collapse-arrow border border-base-300 bg-base-100"
            >
              <input type="checkbox" />
              <div className="collapse-title text-lg font-medium">
                Is BrainBox free to use?
              </div>
              <div className="collapse-content text-base-content/80">
                <p>
                  Yes! BrainBox offers free features for all students. Premium
                  plans with advanced tools are also available.
                </p>
              </div>
            </div>

            <div
              data-aos="fade-right"
              data-aos-duration="6000"
              className="collapse collapse-arrow border border-base-300 bg-base-100"
            >
              <input type="checkbox" />
              <div className="collapse-title text-lg font-medium">
                Who can use BrainBox?
              </div>
              <div className="collapse-content text-base-content/80">
                <p>
                  BrainBox is designed for students, educators, and campus
                  communities worldwide.
                </p>
              </div>
            </div>

            <div
              data-aos="fade-left"
              data-aos-duration="8000"
              className="collapse collapse-arrow border border-base-300 bg-base-100"
            >
              <input type="checkbox" />
              <div className="collapse-title text-lg font-medium">
                Can I use BrainBox offline?
              </div>
              <div className="collapse-content text-base-content/80">
                <p>
                  Unfortunately, BrainBox does not provide offline support. You
                  need an active internet connection to access our platform.
                </p>
              </div>
            </div>

            <div
              data-aos="fade-right"
              data-aos-duration="10000"
              className="collapse collapse-arrow border border-base-300 bg-base-100"
            >
              <input type="checkbox" />
              <div className="collapse-title text-lg font-medium">
                How can I contact support?
              </div>
              <div className="collapse-content text-base-content/80">
                <p>
                  You can reach us directly through email or WhatsApp listed in
                  the contact section below.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Privacy Policy Section */}
      <section className="py-12 sm:py-16">
        <div className={classes.section}>
          <h2 className="text-3xl sm:text-4xl font-bold mb-6 text-center">
            Privacy Policy
          </h2>
          <p className="text-base leading-7 text-base-content/80 max-w-4xl mx-auto">
            At BrainBox, we respect your privacy and are committed to protecting
            your personal information. We only collect the data necessary to
            provide our services and improve your experience. Your information
            is never shared with third parties without your consent, except when
            required by law. By using BrainBox, you agree to our data practices
            and security measures designed to keep your information safe.
          </p>
        </div>
      </section>

      {/* Terms of Use Section */}
      <section className="py-12 sm:py-16 bg-base-100 border-t border-base-300">
        <div className={classes.section}>
          <h2 className="text-3xl sm:text-4xl font-bold mb-6 text-center">
            Terms of Use
          </h2>
          <p className="text-base leading-7 text-base-content/80 max-w-4xl mx-auto mb-4">
            By accessing and using BrainBox, you agree to abide by our terms and
            conditions. You are responsible for maintaining the security of your
            account and using our tools in a lawful and respectful manner.
            Misuse of BrainBox, including unauthorized access, data
            manipulation, or harmful activities, may result in suspension of
            your account.
          </p>
          <p className="text-base leading-7 text-base-content/80 max-w-4xl mx-auto">
            BrainBox reserves the right to update these terms at any time. We
            encourage users to review this section periodically to stay informed
            about their rights and responsibilities.
          </p>
        </div>
      </section>

      {/* Call to Action / Contact */}
      <section className="py-12 sm:py-16 mb-20 md:mb-0">
        <div data-aos="zoom-out" data-aos-duration="2000" className="text-center max-w-2xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">Get in Touch</h2>
          <p className="text-base-content/80 mb-6">
            Have questions, feedback, or want to collaborate? We’d love to hear
            from you.
          </p>
          <div className="flex justify-around flex-wrap gap-4">
            <p className="flex gap-3 text-lg items-center">
              <ImMail2 size={20} />
              shahan.al.munim@gmail.com
            </p>
            <p className="flex gap-3 text-lg items-center">
              <BsWhatsapp size={20} />
              +8801705620458
            </p>
          </div>
        </div>
      </section>

      <ThemeButton />
      <Navbar></Navbar>
    </div>
  );
};

export default About;
