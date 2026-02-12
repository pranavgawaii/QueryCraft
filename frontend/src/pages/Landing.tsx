import { ArrowRight, Check, Database, Zap, Shield, Users } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/Button";
import { ThemeToggle } from "@/components/ui/ThemeToggle";

const sqlQueries = [
  "SELECT * FROM users WHERE active = true",
  "SELECT name, email FROM customers ORDER BY created_at DESC",
  "SELECT COUNT(*) FROM orders WHERE status = 'completed'",
  "SELECT u.name, o.total FROM users u JOIN orders o ON u.id = o.user_id",
  "SELECT product, SUM(quantity) FROM sales GROUP BY product",
];



export const Landing = () => {
  const [currentQuery, setCurrentQuery] = useState(0);
  const [displayedText, setDisplayedText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const query = sqlQueries[currentQuery];
    const timeout = setTimeout(
      () => {
        if (!isDeleting) {
          if (displayedText.length < query.length) {
            setDisplayedText(query.slice(0, displayedText.length + 1));
          } else {
            setTimeout(() => setIsDeleting(true), 2000);
          }
        } else {
          if (displayedText.length > 0) {
            setDisplayedText(displayedText.slice(0, -1));
          } else {
            setIsDeleting(false);
            setCurrentQuery((prev) => (prev + 1) % sqlQueries.length);
          }
        }
      },
      isDeleting ? 30 : 50
    );

    return () => clearTimeout(timeout);
  }, [displayedText, isDeleting, currentQuery]);

  return (
    <div className="min-h-screen">
      {/* Navigation */}
      <nav className="fixed top-0 z-50 w-full border-b border-neutral-200 bg-white/80 backdrop-blur-lg dark:border-neutral-800 dark:bg-neutral-950/80">
        <div className="mx-auto max-w-6xl px-6">
          <div className="flex h-16 items-center justify-between">
            <Link to="/" className="flex items-center gap-2">
              <Database className="h-6 w-6" />
              <span className="text-lg font-semibold">QueryCraft</span>
            </Link>
            <div className="flex items-center gap-4">
              <ThemeToggle />
              <Link to="/login">
                <Button variant="ghost" size="sm">Sign in</Button>
              </Link>
              <Link to="/signup">
                <Button size="sm">Get Started</Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero with Premium SQL Pattern Background */}
      <section className="relative overflow-hidden px-6 pt-32 pb-20">
        {/* Animated Grid Pattern - More visible */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808033_1px,transparent_1px),linear-gradient(to_bottom,#80808033_1px,transparent_1px)] bg-[size:48px_48px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_110%)]"></div>
        </div>

        <div className="relative mx-auto max-w-4xl text-center">
          {/* Premium Floating SQL Keywords - Left Side (subtle with icons) */}
          <div className="absolute -left-32 top-20 hidden xl:block">
            <div
              className="group animate-float-slow cursor-default rounded-xl border border-neutral-200/50 bg-white/60 px-4 py-2.5 backdrop-blur-md transition-all duration-300 hover:border-purple-300/50 hover:bg-white/80 hover:shadow-lg dark:border-neutral-800/50 dark:bg-neutral-900/60 dark:hover:border-purple-700/50 dark:hover:bg-neutral-900/80"
              style={{ animationDelay: "0s" }}
            >
              <div className="flex items-center gap-2">
                <div className="flex h-6 w-6 items-center justify-center rounded-md bg-purple-100 dark:bg-purple-900/30">
                  <svg className="h-4 w-4 text-purple-600 dark:text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
                <span className="font-mono text-sm font-semibold text-neutral-700 dark:text-neutral-300">SELECT</span>
              </div>
            </div>
          </div>
          <div className="absolute -left-36 top-40 hidden xl:block">
            <div
              className="group animate-float-medium cursor-default rounded-xl border border-neutral-200/50 bg-white/60 px-4 py-2.5 backdrop-blur-md transition-all duration-300 hover:border-blue-300/50 hover:bg-white/80 hover:shadow-lg dark:border-neutral-800/50 dark:bg-neutral-900/60 dark:hover:border-blue-700/50 dark:hover:bg-neutral-900/80"
              style={{ animationDelay: "1s" }}
            >
              <div className="flex items-center gap-2">
                <div className="flex h-6 w-6 items-center justify-center rounded-md bg-blue-100 dark:bg-blue-900/30">
                  <svg className="h-4 w-4 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4" />
                  </svg>
                </div>
                <span className="font-mono text-sm font-semibold text-neutral-700 dark:text-neutral-300">FROM</span>
              </div>
            </div>
          </div>
          <div className="absolute -left-32 top-60 hidden xl:block">
            <div
              className="group animate-float-fast cursor-default rounded-xl border border-neutral-200/50 bg-white/60 px-4 py-2.5 backdrop-blur-md transition-all duration-300 hover:border-green-300/50 hover:bg-white/80 hover:shadow-lg dark:border-neutral-800/50 dark:bg-neutral-900/60 dark:hover:border-green-700/50 dark:hover:bg-neutral-900/80"
              style={{ animationDelay: "2s" }}
            >
              <div className="flex items-center gap-2">
                <div className="flex h-6 w-6 items-center justify-center rounded-md bg-green-100 dark:bg-green-900/30">
                  <svg className="h-4 w-4 text-green-600 dark:text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                  </svg>
                </div>
                <span className="font-mono text-sm font-semibold text-neutral-700 dark:text-neutral-300">WHERE</span>
              </div>
            </div>
          </div>

          {/* Premium Floating SQL Keywords - Right Side (subtle with icons) */}
          <div className="absolute -right-32 top-20 hidden xl:block">
            <div
              className="group animate-float-medium cursor-default rounded-xl border border-neutral-200/50 bg-white/60 px-4 py-2.5 backdrop-blur-md transition-all duration-300 hover:border-indigo-300/50 hover:bg-white/80 hover:shadow-lg dark:border-neutral-800/50 dark:bg-neutral-900/60 dark:hover:border-indigo-700/50 dark:hover:bg-neutral-900/80"
              style={{ animationDelay: "0.5s" }}
            >
              <div className="flex items-center gap-2">
                <div className="flex h-6 w-6 items-center justify-center rounded-md bg-indigo-100 dark:bg-indigo-900/30">
                  <svg className="h-4 w-4 text-indigo-600 dark:text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                  </svg>
                </div>
                <span className="font-mono text-sm font-semibold text-neutral-700 dark:text-neutral-300">JOIN</span>
              </div>
            </div>
          </div>
          <div className="absolute -right-36 top-40 hidden xl:block">
            <div
              className="group animate-float-fast cursor-default rounded-xl border border-neutral-200/50 bg-white/60 px-4 py-2.5 backdrop-blur-md transition-all duration-300 hover:border-orange-300/50 hover:bg-white/80 hover:shadow-lg dark:border-neutral-800/50 dark:bg-neutral-900/60 dark:hover:border-orange-700/50 dark:hover:bg-neutral-900/80"
              style={{ animationDelay: "1.5s" }}
            >
              <div className="flex items-center gap-2">
                <div className="flex h-6 w-6 items-center justify-center rounded-md bg-orange-100 dark:bg-orange-900/30">
                  <svg className="h-4 w-4 text-orange-600 dark:text-orange-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12" />
                  </svg>
                </div>
                <span className="font-mono text-sm font-semibold text-neutral-700 dark:text-neutral-300">ORDER BY</span>
              </div>
            </div>
          </div>
          <div className="absolute -right-32 top-60 hidden xl:block">
            <div
              className="group animate-float-slow cursor-default rounded-xl border border-neutral-200/50 bg-white/60 px-4 py-2.5 backdrop-blur-md transition-all duration-300 hover:border-pink-300/50 hover:bg-white/80 hover:shadow-lg dark:border-neutral-800/50 dark:bg-neutral-900/60 dark:hover:border-pink-700/50 dark:hover:bg-neutral-900/80"
              style={{ animationDelay: "2.5s" }}
            >
              <div className="flex items-center gap-2">
                <div className="flex h-6 w-6 items-center justify-center rounded-md bg-pink-100 dark:bg-pink-900/30">
                  <svg className="h-4 w-4 text-pink-600 dark:text-pink-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                </div>
                <span className="font-mono text-sm font-semibold text-neutral-700 dark:text-neutral-300">GROUP BY</span>
              </div>
            </div>
          </div>

          {/* Subtle Gradient Orbs - Removed */}
          {/* Animated SQL Query */}
          <div className="mb-8 flex justify-center">
            <div className="inline-flex items-center gap-2 rounded-lg border border-neutral-200 bg-white/80 px-4 py-2 font-mono text-sm backdrop-blur-sm dark:border-neutral-800 dark:bg-neutral-900/80">
              <span className="text-purple-600 dark:text-purple-400">SELECT</span>
              <span className="text-neutral-900 dark:text-neutral-100">
                {displayedText}
                <span className="animate-pulse">|</span>
              </span>
            </div>
          </div>

          <h1 className="mb-6 text-5xl font-bold tracking-tight sm:text-6xl lg:text-7xl">
            Build SQL queries
            <br />
            <span className="text-neutral-500 dark:text-neutral-400">visually</span>
          </h1>
          <p className="mb-10 text-lg text-neutral-600 dark:text-neutral-400 sm:text-xl">
            The modern query builder for teams. Connect your database,
            <br />
            build queries visually, and get results instantly.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link to="/signup">
              <Button size="lg" className="h-12 px-8">
                Start building free
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link to="/login">
              <Button size="lg" variant="outline" className="h-12 px-8">
                View demo
              </Button>
            </Link>
          </div>
          <p className="mt-6 text-sm text-neutral-500">
            No credit card required • Free forever
          </p>
        </div>

        {/* Preview with SQL Animation */}
        <div className="relative mx-auto mt-20 max-w-5xl">
          <div className="overflow-hidden rounded-xl border border-neutral-200 bg-white shadow-2xl dark:border-neutral-800 dark:bg-neutral-900">
            <div className="border-b border-neutral-200 bg-neutral-50 px-4 py-3 dark:border-neutral-800 dark:bg-neutral-900">
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-red-400"></div>
                <div className="h-3 w-3 rounded-full bg-yellow-400"></div>
                <div className="h-3 w-3 rounded-full bg-green-400"></div>
                <span className="ml-2 text-xs text-neutral-500">query-builder.sql</span>
              </div>
            </div>
            <div className="bg-neutral-50 p-8 dark:bg-neutral-950">
              <div className="space-y-3 font-mono text-sm">
                <div className="flex items-start gap-2">
                  <span className="text-neutral-400">1</span>
                  <div className="flex-1">
                    <span className="text-purple-600 dark:text-purple-400">SELECT</span>
                    <span className="text-neutral-900 dark:text-neutral-100"> users.name, orders.total</span>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-neutral-400">2</span>
                  <div className="flex-1">
                    <span className="text-purple-600 dark:text-purple-400">FROM</span>
                    <span className="text-blue-600 dark:text-blue-400"> users</span>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-neutral-400">3</span>
                  <div className="flex-1">
                    <span className="text-purple-600 dark:text-purple-400">INNER JOIN</span>
                    <span className="text-blue-600 dark:text-blue-400"> orders</span>
                    <span className="text-purple-600 dark:text-purple-400"> ON</span>
                    <span className="text-neutral-900 dark:text-neutral-100"> users.id = orders.user_id</span>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-neutral-400">4</span>
                  <div className="flex-1">
                    <span className="text-purple-600 dark:text-purple-400">WHERE</span>
                    <span className="text-neutral-900 dark:text-neutral-100"> orders.status = </span>
                    <span className="text-green-600 dark:text-green-400">'completed'</span>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-neutral-400">5</span>
                  <div className="flex-1">
                    <span className="text-purple-600 dark:text-purple-400">ORDER BY</span>
                    <span className="text-neutral-900 dark:text-neutral-100"> orders.total </span>
                    <span className="text-purple-600 dark:text-purple-400">DESC</span>
                  </div>
                </div>
                
                {/* Results Section */}
                <div className="mt-6 border-t border-neutral-200 pt-4 dark:border-neutral-800">
                  <div className="mb-2 flex items-center gap-2 text-xs text-neutral-500">
                    <div className="h-2 w-2 animate-pulse rounded-full bg-green-500"></div>
                    <span>Query executed successfully</span>
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="rounded-lg border border-neutral-200 bg-white p-3 dark:border-neutral-800 dark:bg-neutral-900">
                      <div className="text-xs text-neutral-500">Rows</div>
                      <div className="mt-1 text-xl font-bold">1,234</div>
                    </div>
                    <div className="rounded-lg border border-neutral-200 bg-white p-3 dark:border-neutral-800 dark:bg-neutral-900">
                      <div className="text-xs text-neutral-500">Time</div>
                      <div className="mt-1 text-xl font-bold">45ms</div>
                    </div>
                    <div className="rounded-lg border border-neutral-200 bg-white p-3 dark:border-neutral-800 dark:bg-neutral-900">
                      <div className="text-xs text-neutral-500">Status</div>
                      <div className="mt-1 flex items-center gap-1">
                        <div className="h-2 w-2 rounded-full bg-green-500"></div>
                        <span className="text-sm font-semibold text-green-600 dark:text-green-400">Success</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="px-6 py-20">
        <div className="mx-auto max-w-6xl">
          <div className="mb-16 text-center">
            <h2 className="mb-4 text-3xl font-bold sm:text-4xl">
              Everything you need
            </h2>
            <p className="text-lg text-neutral-600 dark:text-neutral-400">
              Powerful features for modern teams
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {[
              {
                icon: Database,
                title: "Visual Builder",
                description: "Build complex queries with drag-and-drop. No SQL knowledge required.",
              },
              {
                icon: Zap,
                title: "Lightning Fast",
                description: "Execute queries in milliseconds with optimized performance.",
              },
              {
                icon: Shield,
                title: "Secure by Default",
                description: "Enterprise-grade security with AES-256 encryption.",
              },
              {
                icon: Users,
                title: "Team Collaboration",
                description: "Share queries and collaborate with your team in real-time.",
              },
              {
                icon: Database,
                title: "Multi-Database",
                description: "Connect to PostgreSQL, MySQL, and more databases.",
              },
              {
                icon: Zap,
                title: "Export Anywhere",
                description: "Export results to CSV, JSON, or integrate with your tools.",
              },
            ].map((feature) => (
              <div
                key={feature.title}
                className="rounded-lg border border-neutral-200 bg-white p-6 dark:border-neutral-800 dark:bg-neutral-900"
              >
                <feature.icon className="mb-4 h-8 w-8" />
                <h3 className="mb-2 text-lg font-semibold">{feature.title}</h3>
                <p className="text-neutral-600 dark:text-neutral-400">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="px-6 py-20">
        <div className="mx-auto max-w-6xl">
          <div className="mb-16 text-center">
            <h2 className="mb-4 text-3xl font-bold sm:text-4xl">
              Simple pricing
            </h2>
            <p className="text-lg text-neutral-600 dark:text-neutral-400">
              Start free, upgrade when you need more
            </p>
          </div>

          <div className="grid gap-8 lg:grid-cols-3">
            {[
              {
                name: "Free",
                price: "$0",
                description: "For individuals",
                features: ["3 connections", "100 queries/month", "Basic support"],
              },
              {
                name: "Pro",
                price: "$29",
                period: "/mo",
                description: "For teams",
                features: [
                  "Unlimited connections",
                  "Unlimited queries",
                  "Priority support",
                  "Team collaboration",
                ],
                popular: true,
              },
              {
                name: "Enterprise",
                price: "Custom",
                description: "For organizations",
                features: [
                  "Everything in Pro",
                  "SSO & SAML",
                  "Dedicated support",
                  "SLA guarantee",
                ],
              },
            ].map((plan) => (
              <div
                key={plan.name}
                className={`rounded-lg border p-8 ${
                  plan.popular
                    ? "border-neutral-900 bg-neutral-900 text-white dark:border-white dark:bg-white dark:text-neutral-900"
                    : "border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-900"
                }`}
              >
                <h3 className="mb-2 text-xl font-semibold">{plan.name}</h3>
                <p className={`text-sm ${plan.popular ? "text-neutral-300 dark:text-neutral-600" : "text-neutral-600 dark:text-neutral-400"}`}>
                  {plan.description}
                </p>
                <div className="my-6">
                  <span className="text-4xl font-bold">{plan.price}</span>
                  {plan.period && <span className={plan.popular ? "text-neutral-300 dark:text-neutral-600" : "text-neutral-600 dark:text-neutral-400"}>{plan.period}</span>}
                </div>
                <Link to="/signup">
                  <Button
                    className={`mb-6 w-full ${
                      plan.popular ? "bg-white text-neutral-900 hover:bg-neutral-100 dark:bg-neutral-900 dark:text-white dark:hover:bg-neutral-800" : ""
                    }`}
                    variant={plan.popular ? "default" : "outline"}
                  >
                    Get started
                  </Button>
                </Link>
                <ul className="space-y-3">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-3">
                      <Check className="h-5 w-5 flex-shrink-0" />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 py-20">
        <div className="mx-auto max-w-4xl">
          <div className="rounded-lg border border-neutral-200 bg-neutral-50 p-12 text-center dark:border-neutral-800 dark:bg-neutral-900">
            <h2 className="mb-4 text-3xl font-bold sm:text-4xl">
              Ready to get started?
            </h2>
            <p className="mb-8 text-lg text-neutral-600 dark:text-neutral-400">
              Join thousands of teams building better queries
            </p>
            <Link to="/signup">
              <Button size="lg" className="h-12 px-8">
                Start building free
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-neutral-200 px-6 py-12 dark:border-neutral-800">
        <div className="mx-auto max-w-6xl">
          <div className="grid gap-8 md:grid-cols-4">
            <div>
              <div className="mb-4 flex items-center gap-2">
                <Database className="h-5 w-5" />
                <span className="font-semibold">QueryCraft</span>
              </div>
              <p className="text-sm text-neutral-600 dark:text-neutral-400">
                Visual SQL query builder
              </p>
            </div>
            <div>
              <h4 className="mb-4 font-semibold">Product</h4>
              <ul className="space-y-2 text-sm text-neutral-600 dark:text-neutral-400">
                <li><a href="#" className="hover:text-neutral-900 dark:hover:text-white">Features</a></li>
                <li><a href="#" className="hover:text-neutral-900 dark:hover:text-white">Pricing</a></li>
              </ul>
            </div>
            <div>
              <h4 className="mb-4 font-semibold">Company</h4>
              <ul className="space-y-2 text-sm text-neutral-600 dark:text-neutral-400">
                <li><a href="#" className="hover:text-neutral-900 dark:hover:text-white">About</a></li>
                <li><a href="#" className="hover:text-neutral-900 dark:hover:text-white">Blog</a></li>
              </ul>
            </div>
            <div>
              <h4 className="mb-4 font-semibold">Legal</h4>
              <ul className="space-y-2 text-sm text-neutral-600 dark:text-neutral-400">
                <li><a href="#" className="hover:text-neutral-900 dark:hover:text-white">Privacy</a></li>
                <li><a href="#" className="hover:text-neutral-900 dark:hover:text-white">Terms</a></li>
              </ul>
            </div>
          </div>
          <div className="mt-12 space-y-1 border-t border-neutral-200 pt-8 text-center text-sm text-neutral-600 dark:border-neutral-800 dark:text-neutral-400">
            <p>
              Design & Developed by{" "}
              <a
                href="https://pranavx.in"
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold text-neutral-900 transition-colors hover:text-purple-600 dark:text-white dark:hover:text-purple-400"
              >
                pranavgawai
              </a>
            </p>
            <p>© 2026 QueryCraft. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};
