"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ThemeToggle } from "@/components/ThemeToggle"

export default function ColorThemeTest() {
  const [isOpen, setIsOpen] = useState(false)

  if (!isOpen) {
    return (
      <Button
        className="fixed left-4 bottom-20 z-50 bg-primary text-primary-foreground"
        onClick={() => setIsOpen(true)}
      >
        Test Colors
      </Button>
    )
  }

  return (
    <div className="fixed inset-0 z-[100] bg-background/80 backdrop-blur-sm flex items-center justify-center p-4">
      <Card className="w-full max-w-3xl max-h-[90vh] overflow-auto">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Color Theme Test</CardTitle>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Button variant="ghost" onClick={() => setIsOpen(false)}>
              Close
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <Tabs defaultValue="colors">
            <TabsList>
              <TabsTrigger value="colors">Colors</TabsTrigger>
              <TabsTrigger value="components">Components</TabsTrigger>
              <TabsTrigger value="text">Typography</TabsTrigger>
            </TabsList>

            <TabsContent value="colors" className="space-y-4">
              <h3 className="text-lg font-medium">Primary Colors</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <ColorSwatch name="primary" color="bg-primary text-primary-foreground" />
                <ColorSwatch name="primary-foreground" color="bg-primary-foreground text-primary" />
                <ColorSwatch name="secondary" color="bg-secondary text-secondary-foreground" />
                <ColorSwatch name="secondary-foreground" color="bg-secondary-foreground text-secondary" />
              </div>

              <h3 className="text-lg font-medium">UI Colors</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <ColorSwatch name="background" color="bg-background text-foreground" />
                <ColorSwatch name="foreground" color="bg-foreground text-background" />
                <ColorSwatch name="card" color="bg-card text-card-foreground" />
                <ColorSwatch name="card-foreground" color="bg-card-foreground text-card" />
                <ColorSwatch name="muted" color="bg-muted text-muted-foreground" />
                <ColorSwatch name="muted-foreground" color="bg-muted-foreground text-muted" />
                <ColorSwatch name="accent" color="bg-accent text-accent-foreground" />
                <ColorSwatch name="accent-foreground" color="bg-accent-foreground text-accent" />
              </div>
            </TabsContent>

            <TabsContent value="components" className="space-y-6">
              <div className="space-y-2">
                <h3 className="text-lg font-medium">Buttons</h3>
                <div className="flex flex-wrap gap-2">
                  <Button>Default</Button>
                  <Button variant="secondary">Secondary</Button>
                  <Button variant="outline">Outline</Button>
                  <Button variant="ghost">Ghost</Button>
                  <Button variant="destructive">Destructive</Button>
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="text-lg font-medium">Form Elements</h3>
                <div className="grid gap-4 max-w-sm">
                  <div className="space-y-2">
                    <Label htmlFor="name">Name</Label>
                    <Input id="name" placeholder="Enter your name" />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="text-lg font-medium">Cards</h3>
                <div className="grid gap-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>Card Title</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p>Card content with text that should be readable.</p>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="text" className="space-y-6">
              <div className="space-y-4">
                <h1 className="text-4xl font-bold">Heading 1</h1>
                <h2 className="text-3xl font-bold">Heading 2</h2>
                <h3 className="text-2xl font-bold">Heading 3</h3>
                <h4 className="text-xl font-bold">Heading 4</h4>
                <h5 className="text-lg font-bold">Heading 5</h5>
                <h6 className="text-base font-bold">Heading 6</h6>
                <p className="text-base">
                  Regular paragraph text that should be readable in both light and dark modes.
                </p>
                <p className="text-sm">Small text that should still be readable.</p>
                <p className="text-xs">Extra small text that must remain readable.</p>
                <div className="flex items-center gap-2">
                  <span className="text-primary">Primary</span>
                  <span className="text-secondary">Secondary</span>
                  <span className="text-muted-foreground">Muted</span>
                  <span className="text-accent-foreground">Accent</span>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}

function ColorSwatch({ name, color }: { name: string; color: string }) {
  return (
    <div className="flex flex-col">
      <div className={`h-16 rounded-md ${color} flex items-center justify-center`}>
        <span className="text-xs font-medium">Text</span>
      </div>
      <span className="text-xs mt-1 text-foreground">{name}</span>
    </div>
  )
}

