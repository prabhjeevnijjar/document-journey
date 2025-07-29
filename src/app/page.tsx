
import Link from 'next/link';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 flex flex-col items-center justify-center px-4 sm:px-6">
      {/* Hero Section */}
      <section className="w-full max-w-2xl text-center">
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-gray-900 dark:text-gray-50 mb-3">
          Document Journey
        </h1>
        <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 mb-8">
          The simplest way to view, annotate, and collect signatures on documents—beautifully and securely, right in your browser.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Button className="px-6 py-3 sm:px-8 text-base sm:text-lg w-full sm:w-auto">
            Get Started
          </Button>
          <Link href="/signup" passHref legacyBehavior>
            <Button variant="secondary" className="px-6 py-3 sm:px-8 text-base sm:text-lg w-full sm:w-auto">
              Start Sending Documents
            </Button>
          </Link>
        </div>
      </section>

      <Separator className="my-8 sm:my-10 w-1/4 mx-auto" />

      {/* Features Section */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 max-w-4xl w-full">
        <Card className="w-full">
          <CardHeader>
            <CardTitle className="text-lg sm:text-xl">Effortless PDF Workflows</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 list-disc list-inside text-gray-700 dark:text-gray-200 text-base sm:text-lg">
              <li>
                <strong>View & Annotate:</strong> Instantly preview PDFs in-browser, highlight, and add notes.
              </li>
              <li>
                <strong>Signature Fields:</strong> Place signature boxes with a simple drag—perfect for contracts, approvals, and forms.
              </li>
            </ul>
          </CardContent>
        </Card>
        <Card className="w-full">
          <CardHeader>
            <CardTitle className="text-lg sm:text-xl">Modern, Secure & Fast</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 list-disc list-inside text-gray-700 dark:text-gray-200 text-base sm:text-lg">
              <li>
                <strong>Seamless Collaboration:</strong> Cloud-ready for team workflows & document sharing.
              </li>
              <li>
                <strong>Reliable Storage:</strong> Built with trusted technologies for safe and rapid document access.
              </li>
            </ul>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
