import { Separator } from "./ui/separator";

const footerSections = [
  {
    title: "Product",
    links: ["Features", "Pricing", "Docs", "API", "Changelog"]
  },
  {
    title: "Company",
    links: ["About", "Blog", "Careers", "Press", "Partners"]
  },
  {
    title: "Connect",
    links: ["Twitter", "GitHub", "Discord", "Contact", "Support"]
  },
  {
    title: "Legal",
    links: ["Privacy", "Terms", "Security", "Cookies"]
  }
];

export function Footer() {
  return (
    <footer className="bg-secondary text-secondary-foreground">
      <div className="container mx-auto max-w-7xl px-6 py-16">
        <div className="grid md:grid-cols-5 gap-8">
          {/* Logo and description */}
          <div className="md:col-span-1 space-y-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <span className="text-primary-foreground text-sm">GS</span>
              </div>
              <span className="text-xl">GitSage</span>
            </div>
            <p className="text-sm text-secondary-foreground/80">
              AI-powered insights for your GitHub repositories.
            </p>
          </div>
          
          {/* Footer links */}
          {footerSections.map((section, index) => (
            <div key={index} className="space-y-4">
              <h4 className="text-sm text-secondary-foreground/90">{section.title}</h4>
              <ul className="space-y-2">
                {section.links.map((link, linkIndex) => (
                  <li key={linkIndex}>
                    <a 
                      href="#" 
                      className="text-sm text-secondary-foreground/70 hover:text-secondary-foreground transition-colors"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        
        <Separator className="my-8 bg-secondary-foreground/20" />
        
        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <p className="text-sm text-secondary-foreground/70">
            © 2025 GitSage. All rights reserved.
          </p>
          <div className="flex space-x-6">
            <a href="#" className="text-sm text-secondary-foreground/70 hover:text-secondary-foreground transition-colors">
              Privacy Policy
            </a>
            <a href="#" className="text-sm text-secondary-foreground/70 hover:text-secondary-foreground transition-colors">
              Terms of Service
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}