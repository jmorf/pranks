import { Header } from '@/components/Header'
import { NavBar } from '@/components/NavBar'
import { generateSEO } from '@/lib/seo'
import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = generateSEO({
  title: 'Privacy Policy',
  description: 'Privacy Policy for PRANKS.com - Learn how we collect, use, and protect your personal information.',
})

export default function PrivacyPolicyPage() {
  const lastUpdated = 'December 3, 2025'

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <NavBar />
      
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <article className="prose prose-neutral dark:prose-invert max-w-none">
          <h1 className="text-3xl font-black mb-2">Privacy Policy</h1>
          <p className="text-muted-foreground mb-8">Last updated: {lastUpdated}</p>

          <section className="mb-8">
            <h2 className="text-xl font-bold mb-4">1. Introduction</h2>
            <p className="text-muted-foreground mb-4">
              Welcome to PRANKS.com (&ldquo;we,&rdquo; &ldquo;our,&rdquo; or &ldquo;us&rdquo;). We are committed to protecting your privacy 
              and ensuring you have a positive experience on our website. This Privacy Policy explains how we 
              collect, use, disclose, and safeguard your information when you visit our website.
            </p>
            <p className="text-muted-foreground mb-4">
              By using PRANKS.com, you agree to the collection and use of information in accordance with this policy.
              If you do not agree with the terms of this privacy policy, please do not access the site.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-bold mb-4">2. Information We Collect</h2>
            
            <h3 className="text-lg font-semibold mb-2">2.1 Personal Data</h3>
            <p className="text-muted-foreground mb-4">
              When you create an account, we may collect:
            </p>
            <ul className="list-disc pl-6 mb-4 text-muted-foreground">
              <li>Email address</li>
              <li>Display name</li>
              <li>Password (encrypted)</li>
            </ul>

            <h3 className="text-lg font-semibold mb-2">2.2 Usage Data</h3>
            <p className="text-muted-foreground mb-4">
              We automatically collect certain information when you visit our website, including:
            </p>
            <ul className="list-disc pl-6 mb-4 text-muted-foreground">
              <li>IP address</li>
              <li>Browser type and version</li>
              <li>Pages visited and time spent</li>
              <li>Referring website</li>
              <li>Device information</li>
            </ul>

            <h3 className="text-lg font-semibold mb-2">2.3 Cookies and Tracking Technologies</h3>
            <p className="text-muted-foreground mb-4">
              We use cookies and similar tracking technologies to track activity on our website. 
              Cookies are files with small amounts of data that may include an anonymous unique identifier.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-bold mb-4">3. How We Use Your Information</h2>
            <p className="text-muted-foreground mb-4">
              We use the collected information for various purposes:
            </p>
            <ul className="list-disc pl-6 mb-4 text-muted-foreground">
              <li>To provide and maintain our service</li>
              <li>To notify you about changes to our service</li>
              <li>To allow you to participate in interactive features (comments, likes)</li>
              <li>To provide customer support</li>
              <li>To gather analysis to improve our service</li>
              <li>To monitor the usage of our service</li>
              <li>To detect, prevent, and address technical issues</li>
              <li>To serve personalized advertisements</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-bold mb-4">4. Advertising</h2>
            
            <h3 className="text-lg font-semibold mb-2">4.1 Google AdSense</h3>
            <p className="text-muted-foreground mb-4">
              We use Google AdSense to display advertisements on our website. Google AdSense uses cookies 
              to serve ads based on your prior visits to our website or other websites. Google&apos;s use of 
              advertising cookies enables it and its partners to serve ads based on your visit to our site 
              and/or other sites on the Internet.
            </p>
            <p className="text-muted-foreground mb-4">
              You may opt out of personalized advertising by visiting{' '}
              <a 
                href="https://www.google.com/settings/ads" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                Google Ads Settings
              </a>.
            </p>

            <h3 className="text-lg font-semibold mb-2">4.2 Third-Party Advertisers</h3>
            <p className="text-muted-foreground mb-4">
              Third-party vendors, including Google, use cookies to serve ads based on your prior visits. 
              You can opt out of third-party vendor&apos;s use of cookies for personalized advertising by visiting{' '}
              <a 
                href="https://www.aboutads.info/choices/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                www.aboutads.info/choices
              </a>.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-bold mb-4">5. GDPR Rights (European Users)</h2>
            <p className="text-muted-foreground mb-4">
              If you are a resident of the European Economic Area (EEA), you have certain data protection rights 
              under the General Data Protection Regulation (GDPR). We aim to take reasonable steps to allow you 
              to correct, amend, delete, or limit the use of your Personal Data.
            </p>
            <p className="text-muted-foreground mb-4">
              You have the following rights:
            </p>
            <ul className="list-disc pl-6 mb-4 text-muted-foreground">
              <li><strong>Right to Access:</strong> You have the right to request copies of your personal data.</li>
              <li><strong>Right to Rectification:</strong> You have the right to request correction of inaccurate data.</li>
              <li><strong>Right to Erasure:</strong> You have the right to request deletion of your personal data.</li>
              <li><strong>Right to Restrict Processing:</strong> You have the right to request restriction of processing.</li>
              <li><strong>Right to Data Portability:</strong> You have the right to receive your data in a structured format.</li>
              <li><strong>Right to Object:</strong> You have the right to object to processing of your personal data.</li>
              <li><strong>Right to Withdraw Consent:</strong> You have the right to withdraw consent at any time.</li>
            </ul>
            <p className="text-muted-foreground mb-4">
              To exercise these rights, please contact us at the email address provided below.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-bold mb-4">6. CCPA Rights (California Users)</h2>
            <p className="text-muted-foreground mb-4">
              If you are a California resident, you have specific rights regarding your personal information 
              under the California Consumer Privacy Act (CCPA):
            </p>
            <ul className="list-disc pl-6 mb-4 text-muted-foreground">
              <li>The right to know what personal information is being collected</li>
              <li>The right to know whether your personal information is sold or disclosed</li>
              <li>The right to say no to the sale of personal information</li>
              <li>The right to access your personal information</li>
              <li>The right to equal service and price, even if you exercise your privacy rights</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-bold mb-4">7. Cookie Policy</h2>
            
            <h3 className="text-lg font-semibold mb-2">7.1 What Are Cookies</h3>
            <p className="text-muted-foreground mb-4">
              Cookies are small text files that are placed on your computer or mobile device when you visit a website. 
              They are widely used to make websites work more efficiently and provide information to the owners of the site.
            </p>

            <h3 className="text-lg font-semibold mb-2">7.2 Types of Cookies We Use</h3>
            <ul className="list-disc pl-6 mb-4 text-muted-foreground">
              <li><strong>Essential Cookies:</strong> Required for the website to function properly (authentication, security).</li>
              <li><strong>Analytics Cookies:</strong> Help us understand how visitors interact with our website (Google Analytics).</li>
              <li><strong>Advertising Cookies:</strong> Used to deliver relevant advertisements (Google AdSense).</li>
              <li><strong>Preference Cookies:</strong> Remember your preferences and settings.</li>
            </ul>

            <h3 className="text-lg font-semibold mb-2">7.3 Managing Cookies</h3>
            <p className="text-muted-foreground mb-4">
              You can control and/or delete cookies as you wish. You can delete all cookies that are already on your 
              computer and set most browsers to prevent them from being placed. However, if you do this, you may have 
              to manually adjust some preferences every time you visit a site.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-bold mb-4">8. Third-Party Services</h2>
            <p className="text-muted-foreground mb-4">
              Our website may contain links to third-party websites and embeds content from third-party services 
              including YouTube and TikTok. We are not responsible for the privacy practices of these third parties. 
              We encourage you to review the privacy policies of any third-party sites you visit.
            </p>
            <ul className="list-disc pl-6 mb-4 text-muted-foreground">
              <li><a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Google Privacy Policy</a></li>
              <li><a href="https://www.tiktok.com/legal/privacy-policy" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">TikTok Privacy Policy</a></li>
              <li><a href="https://www.youtube.com/howyoutubeworks/our-commitments/protecting-user-data/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">YouTube Privacy</a></li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-bold mb-4">9. Data Security</h2>
            <p className="text-muted-foreground mb-4">
              We use administrative, technical, and physical security measures to help protect your personal information. 
              While we have taken reasonable steps to secure the personal information you provide to us, please be aware 
              that no security measures are perfect or impenetrable, and no method of data transmission can be guaranteed 
              against interception or other types of misuse.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-bold mb-4">10. Data Retention</h2>
            <p className="text-muted-foreground mb-4">
              We will retain your personal information only for as long as is necessary for the purposes set out in 
              this Privacy Policy. We will retain and use your information to the extent necessary to comply with our 
              legal obligations, resolve disputes, and enforce our policies.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-bold mb-4">11. Children&apos;s Privacy</h2>
            <p className="text-muted-foreground mb-4">
              Our website is not intended for children under 13 years of age. We do not knowingly collect personal 
              information from children under 13. If you are a parent or guardian and believe your child has provided 
              us with personal information, please contact us so we can delete such information.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-bold mb-4">12. Changes to This Privacy Policy</h2>
            <p className="text-muted-foreground mb-4">
              We may update our Privacy Policy from time to time. We will notify you of any changes by posting the 
              new Privacy Policy on this page and updating the &ldquo;Last updated&rdquo; date. You are advised to review this 
              Privacy Policy periodically for any changes.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-bold mb-4">13. Contact Us</h2>
            <p className="text-muted-foreground mb-4">
              If you have any questions about this Privacy Policy, please contact us:
            </p>
            <ul className="list-disc pl-6 mb-4 text-muted-foreground">
              <li>By email: privacy@pranks.com</li>
              <li>By visiting this page on our website: <Link href="/contact" className="text-primary hover:underline">Contact Us</Link></li>
            </ul>
          </section>
        </article>
      </main>
      
      {/* Footer */}
      <footer className="mt-auto border-t border-border py-8">
        <div className="container mx-auto px-4 text-center">
          <div className="flex justify-center gap-4 mb-4">
            <Link href="/privacy" className="text-sm text-muted-foreground hover:text-primary">
              Privacy Policy
            </Link>
            <Link href="/terms" className="text-sm text-muted-foreground hover:text-primary">
              Terms of Service
            </Link>
          </div>
          <p className="text-sm font-bold text-primary">
            KEEP SCROLLING. YOUR BOSS ISN&apos;T WATCHING. PROBABLY.
          </p>
          <p className="text-xs text-muted-foreground mt-2">
            © {new Date().getFullYear()} PRANKS.com. No feelings were harmed.
          </p>
        </div>
      </footer>
    </div>
  )
}
