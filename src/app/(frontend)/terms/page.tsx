import { Header } from '@/components/Header'
import { NavBar } from '@/components/NavBar'
import { generateSEO } from '@/lib/seo'
import type { Metadata } from 'next'
import Link from 'next/link'
import { headers as getHeaders } from 'next/headers.js'
import { getPayload } from 'payload'
import config from '@/payload.config'
import { User } from '@/payload-types'

export const metadata: Metadata = generateSEO({
  title: 'Terms of Service',
  description: 'Terms of Service for PRANKS.com - Read our terms and conditions for using our website.',
})

export default async function TermsPage() {
  const headers = await getHeaders()
  const payloadConfig = await config
  const payload = await getPayload({ config: payloadConfig })
  const { user } = await payload.auth({ headers })

  const lastUpdated = 'December 3, 2025'

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header user={user as User | null} />
      <NavBar />
      
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <article className="prose prose-neutral dark:prose-invert max-w-none">
          <h1 className="text-3xl font-black mb-2">Terms of Service</h1>
          <p className="text-muted-foreground mb-8">Last updated: {lastUpdated}</p>

          <section className="mb-8">
            <h2 className="text-xl font-bold mb-4">1. Agreement to Terms</h2>
            <p className="text-muted-foreground mb-4">
              By accessing or using PRANKS.com (&ldquo;the Website&rdquo;, &ldquo;we&rdquo;, &ldquo;us&rdquo;, or &ldquo;our&rdquo;), you agree to be bound by 
              these Terms of Service (&ldquo;Terms&rdquo;). If you disagree with any part of the terms, you do not have 
              permission to access the Website.
            </p>
            <p className="text-muted-foreground mb-4">
              These Terms apply to all visitors, users, and others who access or use the Website.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-bold mb-4">2. Description of Service</h2>
            <p className="text-muted-foreground mb-4">
              PRANKS.com is an entertainment website that aggregates and displays prank videos from various 
              platforms including YouTube and TikTok. We provide a platform for users to discover, view, like, 
              comment on, and share prank video content. We do not host the video content directly; videos are 
              embedded from their original platforms.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-bold mb-4">3. User Accounts</h2>
            
            <h3 className="text-lg font-semibold mb-2">3.1 Account Creation</h3>
            <p className="text-muted-foreground mb-4">
              To access certain features of the Website (such as liking videos or leaving comments), you may need 
              to create an account. You must provide accurate and complete information when creating your account.
            </p>

            <h3 className="text-lg font-semibold mb-2">3.2 Account Security</h3>
            <p className="text-muted-foreground mb-4">
              You are responsible for safeguarding the password that you use to access the Website and for any 
              activities or actions under your password. You agree not to disclose your password to any third party.
            </p>

            <h3 className="text-lg font-semibold mb-2">3.3 Account Termination</h3>
            <p className="text-muted-foreground mb-4">
              We reserve the right to terminate or suspend your account immediately, without prior notice or liability, 
              for any reason whatsoever, including without limitation if you breach the Terms.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-bold mb-4">4. User Content</h2>
            
            <h3 className="text-lg font-semibold mb-2">4.1 Comments and Submissions</h3>
            <p className="text-muted-foreground mb-4">
              Users may post comments and submit video suggestions. By posting content, you grant us a non-exclusive, 
              worldwide, royalty-free license to use, reproduce, modify, and display such content in connection with 
              the Website.
            </p>

            <h3 className="text-lg font-semibold mb-2">4.2 Content Guidelines</h3>
            <p className="text-muted-foreground mb-4">
              You agree not to post content that:
            </p>
            <ul className="list-disc pl-6 mb-4 text-muted-foreground">
              <li>Is unlawful, harmful, threatening, abusive, harassing, defamatory, or invasive of privacy</li>
              <li>Contains hate speech, discrimination, or promotes violence</li>
              <li>Is sexually explicit or pornographic</li>
              <li>Infringes on any patent, trademark, copyright, or other proprietary rights</li>
              <li>Contains software viruses or any other malicious code</li>
              <li>Is spam, advertising, or promotional material without authorization</li>
              <li>Impersonates any person or entity</li>
            </ul>

            <h3 className="text-lg font-semibold mb-2">4.3 Content Moderation</h3>
            <p className="text-muted-foreground mb-4">
              We reserve the right to remove or modify any user content for any reason, including content that 
              violates these Terms or that we find objectionable.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-bold mb-4">5. Intellectual Property</h2>
            
            <h3 className="text-lg font-semibold mb-2">5.1 Website Content</h3>
            <p className="text-muted-foreground mb-4">
              The Website and its original content (excluding content provided by users and embedded videos), 
              features, and functionality are and will remain the exclusive property of PRANKS.com.
            </p>

            <h3 className="text-lg font-semibold mb-2">5.2 Embedded Content</h3>
            <p className="text-muted-foreground mb-4">
              Videos displayed on the Website are embedded from third-party platforms (YouTube, TikTok, etc.) 
              and remain the property of their respective owners. We do not claim ownership of any embedded video content.
            </p>

            <h3 className="text-lg font-semibold mb-2">5.3 DMCA Compliance</h3>
            <p className="text-muted-foreground mb-4">
              We respect the intellectual property rights of others. If you believe that content available on the 
              Website infringes your copyright, please contact us with a detailed DMCA takedown notice at: 
              dmca@pranks.com
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-bold mb-4">6. Advertising and Third-Party Links</h2>
            
            <h3 className="text-lg font-semibold mb-2">6.1 Advertisements</h3>
            <p className="text-muted-foreground mb-4">
              The Website may display advertisements from third-party advertising networks, including Google AdSense. 
              We are not responsible for the content of these advertisements or any products or services offered by advertisers.
            </p>

            <h3 className="text-lg font-semibold mb-2">6.2 Third-Party Links</h3>
            <p className="text-muted-foreground mb-4">
              The Website may contain links to third-party websites or services that are not owned or controlled by us. 
              We have no control over, and assume no responsibility for, the content, privacy policies, or practices of 
              any third-party websites or services.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-bold mb-4">7. Disclaimers</h2>
            
            <h3 className="text-lg font-semibold mb-2">7.1 Entertainment Purpose</h3>
            <p className="text-muted-foreground mb-4">
              The content on this Website is provided for entertainment purposes only. We do not endorse, encourage, 
              or recommend attempting to recreate any pranks shown in videos. Many pranks may be staged, edited, or 
              performed by professionals. Attempting to recreate pranks could result in injury, property damage, or 
              legal consequences.
            </p>

            <h3 className="text-lg font-semibold mb-2">7.2 No Warranty</h3>
            <p className="text-muted-foreground mb-4">
              THE WEBSITE IS PROVIDED ON AN &ldquo;AS IS&rdquo; AND &ldquo;AS AVAILABLE&rdquo; BASIS WITHOUT ANY WARRANTIES OF ANY KIND, 
              EITHER EXPRESS OR IMPLIED. WE DO NOT WARRANT THAT THE WEBSITE WILL BE UNINTERRUPTED, SECURE, OR ERROR-FREE.
            </p>

            <h3 className="text-lg font-semibold mb-2">7.3 Video Content</h3>
            <p className="text-muted-foreground mb-4">
              We do not verify the authenticity or safety of pranks shown in videos. Videos may contain content that 
              some viewers may find offensive, disturbing, or inappropriate. Viewer discretion is advised.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-bold mb-4">8. Limitation of Liability</h2>
            <p className="text-muted-foreground mb-4">
              TO THE MAXIMUM EXTENT PERMITTED BY LAW, IN NO EVENT SHALL PRANKS.COM, ITS DIRECTORS, EMPLOYEES, PARTNERS, 
              AGENTS, SUPPLIERS, OR AFFILIATES BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR 
              PUNITIVE DAMAGES, INCLUDING WITHOUT LIMITATION, LOSS OF PROFITS, DATA, USE, GOODWILL, OR OTHER INTANGIBLE 
              LOSSES, RESULTING FROM:
            </p>
            <ul className="list-disc pl-6 mb-4 text-muted-foreground">
              <li>Your access to or use of or inability to access or use the Website</li>
              <li>Any conduct or content of any third party on the Website</li>
              <li>Any content obtained from the Website</li>
              <li>Unauthorized access, use, or alteration of your transmissions or content</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-bold mb-4">9. Indemnification</h2>
            <p className="text-muted-foreground mb-4">
              You agree to defend, indemnify, and hold harmless PRANKS.com and its licensees, licensors, employees, 
              contractors, agents, officers, and directors from and against any and all claims, damages, obligations, 
              losses, liabilities, costs, or debt arising from:
            </p>
            <ul className="list-disc pl-6 mb-4 text-muted-foreground">
              <li>Your use of and access to the Website</li>
              <li>Your violation of any term of these Terms</li>
              <li>Your violation of any third-party right, including any copyright, property, or privacy right</li>
              <li>Any claim that your content caused damage to a third party</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-bold mb-4">10. Governing Law</h2>
            <p className="text-muted-foreground mb-4">
              These Terms shall be governed and construed in accordance with the laws of the United States, 
              without regard to its conflict of law provisions. Our failure to enforce any right or provision 
              of these Terms will not be considered a waiver of those rights.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-bold mb-4">11. Changes to Terms</h2>
            <p className="text-muted-foreground mb-4">
              We reserve the right, at our sole discretion, to modify or replace these Terms at any time. 
              If a revision is material, we will try to provide at least 30 days notice prior to any new terms 
              taking effect. What constitutes a material change will be determined at our sole discretion.
            </p>
            <p className="text-muted-foreground mb-4">
              By continuing to access or use our Website after those revisions become effective, you agree to 
              be bound by the revised terms.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-bold mb-4">12. Severability</h2>
            <p className="text-muted-foreground mb-4">
              If any provision of these Terms is held to be unenforceable or invalid, such provision will be 
              changed and interpreted to accomplish the objectives of such provision to the greatest extent 
              possible under applicable law, and the remaining provisions will continue in full force and effect.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-bold mb-4">13. Entire Agreement</h2>
            <p className="text-muted-foreground mb-4">
              These Terms constitute the entire agreement between us regarding our Website and supersede and 
              replace any prior agreements we might have had between us regarding the Website.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-bold mb-4">14. Contact Us</h2>
            <p className="text-muted-foreground mb-4">
              If you have any questions about these Terms, please contact us:
            </p>
            <ul className="list-disc pl-6 mb-4 text-muted-foreground">
              <li>By email: legal@pranks.com</li>
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
