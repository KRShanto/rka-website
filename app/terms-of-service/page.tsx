"use client"
import { motion } from "framer-motion"

export default function TermsOfService() {
  return (
    <div className="bg-background min-h-screen pt-16">
      <section className="bg-primary dark:bg-gray-900 text-primary-foreground py-20">
        <div className="container mx-auto px-4">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-4xl font-bold mb-4 dark:text-white"
          >
            Terms of Service
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-xl"
          >
            Please read these terms carefully before using our services
          </motion.p>
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 md:p-8">
            <div className="prose dark:prose-invert max-w-none">
              <h2>Agreement to Terms</h2>
              <p>
                These Terms of Service constitute a legally binding agreement made between you and Bangladesh Wadokai
                Karate Do (BWKD), concerning your access to and use of our website and services. You agree that by
                accessing the website and/or services, you have read, understood, and agree to be bound by all of these
                Terms of Service.
              </p>
              <p>
                IF YOU DO NOT AGREE WITH ALL OF THESE TERMS OF SERVICE, THEN YOU ARE EXPRESSLY PROHIBITED FROM USING THE
                WEBSITE AND SERVICES AND YOU MUST DISCONTINUE USE IMMEDIATELY.
              </p>

              <h2>Intellectual Property Rights</h2>
              <p>
                Unless otherwise indicated, the website and services are our proprietary property and all source code,
                databases, functionality, software, website designs, audio, video, text, photographs, and graphics on
                the website (collectively, the "Content") and the trademarks, service marks, and logos contained therein
                (the "Marks") are owned or controlled by us or licensed to us, and are protected by copyright and
                trademark laws and various other intellectual property rights.
              </p>
              <p>
                The Content and Marks are provided on the website "AS IS" for your information and personal use only.
                Except as expressly provided in these Terms of Service, no part of the website or services and no
                Content or Marks may be copied, reproduced, aggregated, republished, uploaded, posted, publicly
                displayed, encoded, translated, transmitted, distributed, sold, licensed, or otherwise exploited for any
                commercial purpose whatsoever, without our express prior written permission.
              </p>

              <h2>User Representations</h2>
              <p>By using the website and services, you represent and warrant that:</p>
              <ol>
                <li>All registration information you submit will be true, accurate, current, and complete.</li>
                <li>
                  You will maintain the accuracy of such information and promptly update such registration information
                  as necessary.
                </li>
                <li>You have the legal capacity and you agree to comply with these Terms of Service.</li>
                <li>
                  You are not a minor in the jurisdiction in which you reside, or if a minor, you have received parental
                  permission to use the website.
                </li>
                <li>
                  You will not access the website or services through automated or non-human means, whether through a
                  bot, script, or otherwise.
                </li>
                <li>You will not use the website or services for any illegal or unauthorized purpose.</li>
                <li>Your use of the website or services will not violate any applicable law or regulation.</li>
              </ol>

              <h2>Fees and Payment</h2>
              <p>We accept the following forms of payment:</p>
              <ul>
                <li>Credit Card</li>
                <li>PayPal</li>
                <li>Bank Transfer</li>
                <li>Cash (for in-person transactions)</li>
              </ul>
              <p>
                You agree to provide current, complete, and accurate purchase and account information for all purchases
                made via the website. You further agree to promptly update account and payment information, including
                email address, payment method, and payment card expiration date, so that we can complete your
                transactions and contact you as needed.
              </p>

              <h2>Cancellation and Refund Policy</h2>
              <p>
                All sales are final and no refund will be issued unless specified in our refund policy. Please review
                our refund policy before making a purchase.
              </p>
              <p>
                For membership cancellations, you must provide written notice at least 30 days before the next billing
                cycle. Failure to do so may result in charges for the next billing cycle.
              </p>

              <h2>Prohibited Activities</h2>
              <p>
                You may not access or use the website or services for any purpose other than that for which we make them
                available. The website and services may not be used in connection with any commercial endeavors except
                those that are specifically endorsed or approved by us.
              </p>
              <p>As a user of the website or services, you agree not to:</p>
              <ol>
                <li>
                  Systematically retrieve data or other content from the website or services to create or compile,
                  directly or indirectly, a collection, compilation, database, or directory without written permission
                  from us.
                </li>
                <li>
                  Make any unauthorized use of the website or services, including collecting usernames and/or email
                  addresses of users by electronic or other means for the purpose of sending unsolicited email, or
                  creating user accounts by automated means or under false pretenses.
                </li>
                <li>Use the website or services to advertise or offer to sell goods and services.</li>
                <li>
                  Circumvent, disable, or otherwise interfere with security-related features of the website or services.
                </li>
                <li>Engage in unauthorized framing of or linking to the website or services.</li>
                <li>
                  Trick, defraud, or mislead us and other users, especially in any attempt to learn sensitive account
                  information such as user passwords.
                </li>
                <li>Make improper use of our support services or submit false reports of abuse or misconduct.</li>
                <li>
                  Engage in any automated use of the system, such as using scripts to send comments or messages, or
                  using any data mining, robots, or similar data gathering and extraction tools.
                </li>
                <li>
                  Interfere with, disrupt, or create an undue burden on the website or services or the networks or
                  services connected to the website or services.
                </li>
                <li>Attempt to impersonate another user or person or use the username of another user.</li>
                <li>
                  Use any information obtained from the website or services in order to harass, abuse, or harm another
                  person.
                </li>
                <li>
                  Use the website or services as part of any effort to compete with us or otherwise use the website or
                  services and/or the Content for any revenue-generating endeavor or commercial enterprise.
                </li>
              </ol>

              <h2>Limitation of Liability</h2>
              <p>
                IN NO EVENT WILL WE OR OUR DIRECTORS, EMPLOYEES, OR AGENTS BE LIABLE TO YOU OR ANY THIRD PARTY FOR ANY
                DIRECT, INDIRECT, CONSEQUENTIAL, EXEMPLARY, INCIDENTAL, SPECIAL, OR PUNITIVE DAMAGES, INCLUDING LOST
                PROFIT, LOST REVENUE, LOSS OF DATA, OR OTHER DAMAGES ARISING FROM YOUR USE OF THE WEBSITE OR SERVICES,
                EVEN IF WE HAVE BEEN ADVISED OF THE POSSIBILITY OF SUCH DAMAGES.
              </p>

              <h2>Indemnification</h2>
              <p>
                You agree to defend, indemnify, and hold us harmless, including our subsidiaries, affiliates, and all of
                our respective officers, agents, partners, and employees, from and against any loss, damage, liability,
                claim, or demand, including reasonable attorneys' fees and expenses, made by any third party due to or
                arising out of: (1) your use of the website or services; (2) breach of these Terms of Service; (3) any
                breach of your representations and warranties set forth in these Terms of Service; (4) your violation of
                the rights of a third party, including but not limited to intellectual property rights; or (5) any overt
                harmful act toward any other user of the website or services with whom you connected via the website or
                services.
              </p>

              <h2>Term and Termination</h2>
              <p>
                These Terms of Service shall remain in full force and effect while you use the website or services.
                WITHOUT LIMITING ANY OTHER PROVISION OF THESE TERMS OF SERVICE, WE RESERVE THE RIGHT TO, IN OUR SOLE
                DISCRETION AND WITHOUT NOTICE OR LIABILITY, DENY ACCESS TO AND USE OF THE WEBSITE AND SERVICES
                (INCLUDING BLOCKING CERTAIN IP ADDRESSES), TO ANY PERSON FOR ANY REASON OR FOR NO REASON, INCLUDING
                WITHOUT LIMITATION FOR BREACH OF ANY REPRESENTATION, WARRANTY, OR COVENANT CONTAINED IN THESE TERMS OF
                SERVICE OR OF ANY APPLICABLE LAW OR REGULATION.
              </p>

              <h2>Changes to Terms of Service</h2>
              <p>
                We reserve the right to change, modify, or remove the contents of these Terms of Service at any time or
                for any reason at our sole discretion without notice. It is your responsibility to check these Terms of
                Service periodically for changes. Your continued use of the website or services following the posting of
                revised Terms of Service means that you accept and agree to the changes.
              </p>

              <h2>Contact Us</h2>
              <p>If you have questions or concerns about these Terms of Service, please contact us at:</p>
              <p>
                Bangladesh Wadokai Karate Do
                <br />
                123 Karate Street, Bansree
                <br />
                Dhaka, Bangladesh
                <br />
                Email: info@bwkd.com
                <br />
                Phone: +880 1234 567890
              </p>

              <p className="text-sm text-gray-500 dark:text-gray-400 mt-8">Last Updated: March 6, 2025</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

