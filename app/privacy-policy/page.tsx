"use client";
import { motion } from "framer-motion";

export default function PrivacyPolicy() {
  return (
    <div className="bg-background min-h-screen">
      <section className="bg-primary text-primary-foreground py-10 mt-14">
        <div className="container mx-auto px-4">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-4xl font-bold mb-4 dark:text-white"
          >
            Privacy Policy
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-xl"
          >
            How we collect, use, and protect your information
          </motion.p>
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 md:p-8">
            <div className="prose dark:prose-invert max-w-none">
              <h2>Introduction</h2>
              <p>
                Bangladesh Wadokai Karate Do (BWKD) is committed to protecting
                your privacy. This Privacy Policy explains how we collect, use,
                disclose, and safeguard your information when you visit our
                website or use our services.
              </p>
              <p>
                Please read this privacy policy carefully. If you do not agree
                with the terms of this privacy policy, please do not access the
                site.
              </p>

              <h2>Information We Collect</h2>
              <p>
                We may collect information about you in a variety of ways. The
                information we may collect includes:
              </p>
              <h3>Personal Data</h3>
              <p>
                When you register for our services, we may collect personally
                identifiable information, such as your:
              </p>
              <ul>
                <li>Name</li>
                <li>Email address</li>
                <li>Phone number</li>
                <li>Date of birth</li>
                <li>Address</li>
                <li>Payment information</li>
              </ul>

              <h3>Usage Data</h3>
              <p>
                We may also collect information on how the website is accessed
                and used. This usage data may include information such as your
                computer's Internet Protocol address (e.g., IP address), browser
                type, browser version, the pages of our website that you visit,
                the time and date of your visit, the time spent on those pages,
                unique device identifiers, and other diagnostic data.
              </p>

              <h2>Use of Your Information</h2>
              <p>
                We may use the information we collect about you for various
                purposes, including to:
              </p>
              <ul>
                <li>Provide, maintain, and improve our services</li>
                <li>Process transactions</li>
                <li>
                  Send you administrative information, such as updates, security
                  alerts, and support messages
                </li>
                <li>Respond to your comments, questions, and requests</li>
                <li>
                  Communicate with you about products, services, offers, and
                  events
                </li>
                <li>
                  Monitor and analyze trends, usage, and activities in
                  connection with our services
                </li>
                <li>
                  Detect, investigate, and prevent fraudulent transactions and
                  other illegal activities
                </li>
                <li>Comply with our legal obligations</li>
              </ul>

              <h2>Disclosure of Your Information</h2>
              <p>
                We may share information we have collected about you in certain
                situations. Your information may be disclosed as follows:
              </p>
              <h3>By Law or to Protect Rights</h3>
              <p>
                If we believe the release of information about you is necessary
                to respond to legal process, to investigate or remedy potential
                violations of our policies, or to protect the rights, property,
                and safety of others, we may share your information as permitted
                or required by any applicable law, rule, or regulation.
              </p>

              <h3>Third-Party Service Providers</h3>
              <p>
                We may share your information with third parties that perform
                services for us or on our behalf, including payment processing,
                data analysis, email delivery, hosting services, customer
                service, and marketing assistance.
              </p>

              <h2>Security of Your Information</h2>
              <p>
                We use administrative, technical, and physical security measures
                to help protect your personal information. While we have taken
                reasonable steps to secure the personal information you provide
                to us, please be aware that despite our efforts, no security
                measures are perfect or impenetrable, and no method of data
                transmission can be guaranteed against any interception or other
                type of misuse.
              </p>

              <h2>Children's Privacy</h2>
              <p>
                Our website and services are not directed to children under the
                age of 13. We do not knowingly collect personal information from
                children under 13. If you are under 13, please do not provide
                any personal information on this website. If you are a parent or
                guardian and you are aware that your child has provided us with
                personal information, please contact us so that we can take
                necessary actions.
              </p>

              <h2>Changes to This Privacy Policy</h2>
              <p>
                We may update our Privacy Policy from time to time. We will
                notify you of any changes by posting the new Privacy Policy on
                this page and updating the "Last Updated" date. You are advised
                to review this Privacy Policy periodically for any changes.
              </p>

              <h2>Contact Us</h2>
              <p>
                If you have questions or concerns about this Privacy Policy,
                please contact us at:
              </p>
              <p>
                Bangladesh Wadokai Karate Do
                <br />
                123 Karate Street, Banasreee
                <br />
                Dhaka, Bangladesh
                <br />
                Email: info@bwkd.com
                <br />
                Phone: +880 1234 567890
              </p>

              <p className="text-sm text-gray-500 dark:text-gray-400 mt-8">
                Last Updated: March 6, 2025
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
