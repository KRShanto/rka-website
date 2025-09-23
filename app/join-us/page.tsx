"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Facebook,
  Youtube,
  Phone,
  Mail,
  MapPin,
  Clock,
  Users,
  Trophy,
  Dumbbell,
} from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import Image from "next/image";
import { useState, useMemo } from "react";
// Using custom API route to upload via UploadThing server SDK
import { createAdmission } from "@/actions/create-admission";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { genUploader } from "uploadthing/client";
import type { OurFileRouter } from "@/app/api/uploadthing/core";
import { useRouter } from "next/navigation";

export default function JoinUs() {
  const router = useRouter();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const previewUrl = useMemo(
    () => (selectedFile ? URL.createObjectURL(selectedFile) : null),
    [selectedFile]
  );
  const { uploadFiles } = genUploader<OurFileRouter>();
  const [successOpen, setSuccessOpen] = useState(false);

  // UploadThing endpoint name: imageUploader
  const benefits = [
    {
      icon: Users,
      title: "Expert Instruction",
      description: "Learn from experienced senseis",
    },
    {
      icon: Dumbbell,
      title: "Comprehensive Training",
      description: "Master various Karate techniques",
    },
    {
      icon: Clock,
      title: "Flexible Schedule",
      description: "Classes available at convenient times",
    },
    {
      icon: Trophy,
      title: "Competition Opportunities",
      description:
        "Participate in local national and international tournaments",
    },
  ];

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    try {
      setIsSubmitting(true);
      const form = e.currentTarget as HTMLFormElement;
      const formData = new FormData(form);

      // Gather form values
      const name = String(formData.get("fullName") || "");
      const fatherName = String(formData.get("fatherName") || "");
      const motherName = String(formData.get("motherName") || "");
      const dateOfBirth = String(formData.get("dob") || "");
      const bloodGroup = String(formData.get("bloodGroup") || "");
      const email = String(formData.get("email") || "");
      const phone = String(formData.get("contactNumber") || "");
      const gender = String(formData.get("gender") || "");

      // Upload image if selected
      let imageUrl: string | undefined;
      if (selectedFile) {
        const res = await uploadFiles("imageUploader", {
          files: [selectedFile],
        });
        console.log(res);
        imageUrl = res?.[0]?.ufsUrl ?? imageUrl;
      }

      // Normalize enums
      const genderEnum = gender.toUpperCase() === "MALE" ? "MALE" : "FEMALE";
      const bloodMap: Record<string, any> = {
        "A+": "A_POS",
        "A-": "A_NEG",
        "B+": "B_POS",
        "B-": "B_NEG",
        "O+": "O_POS",
        "O-": "O_NEG",
        "AB+": "AB_POS",
        "AB-": "AB_NEG",
      };
      const bloodEnum = bloodMap[bloodGroup] ?? undefined;

      const res = await createAdmission({
        name,
        fatherName,
        motherName,
        dateOfBirth,
        bloodGroup: bloodEnum,
        email,
        phone,
        gender: genderEnum as "MALE" | "FEMALE",
        imageUrl,
      });

      if (!res.ok) {
        console.error(res.error);
        alert(res.error);
        return;
      }
      setSuccessOpen(true);
      form.reset();
      setSelectedFile(null);
    } catch (err) {
      alert("Failed to submit admission");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="bg-gray-100 min-h-screen">
      <section className="bg-primary text-white py-10 mt-14">
        <div className="container mx-auto px-4">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-4xl font-bold mb-4"
          >
            Join RKA
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-xl"
          >
            Begin your karate journey with us today
          </motion.p>
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="text-3xl font-bold mb-6 text-center">
                Become Part of Our Dojo
              </h2>
              <p className="mb-8 text-lg text-center">
                At RKA, we welcome students of all ages and skill levels.
                Whether you're a complete beginner or an experienced martial
                artist, our programs are designed to help you grow and excel.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="mb-12"
            >
              <Card className="bg-white">
                <CardHeader>
                  <CardTitle className="text-2xl font-semibold">
                    Registration Form
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <form
                    className="grid grid-cols-1 md:grid-cols-2 gap-6"
                    onSubmit={handleSubmit}
                  >
                    <div className="flex flex-col gap-2">
                      <Label htmlFor="fullName">Full Name</Label>
                      <Input
                        id="fullName"
                        name="fullName"
                        placeholder="Enter full name"
                        required
                      />
                    </div>
                    <div className="flex flex-col gap-2">
                      <Label htmlFor="fatherName">Father's Name</Label>
                      <Input
                        id="fatherName"
                        name="fatherName"
                        placeholder="Enter father's name"
                        required
                      />
                    </div>
                    <div className="flex flex-col gap-2">
                      <Label htmlFor="motherName">Mother's Name</Label>
                      <Input
                        id="motherName"
                        name="motherName"
                        placeholder="Enter mother's name"
                        required
                      />
                    </div>
                    <div className="flex flex-col gap-2">
                      <Label htmlFor="dob">Date of Birth</Label>
                      <Input id="dob" name="dob" type="date" required />
                    </div>
                    <div className="flex flex-col gap-2">
                      <Label htmlFor="bloodGroup">Blood Group</Label>
                      <Select name="bloodGroup">
                        <SelectTrigger id="bloodGroup">
                          <SelectValue placeholder="Select blood group" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="A+">A+</SelectItem>
                          <SelectItem value="A-">A-</SelectItem>
                          <SelectItem value="B+">B+</SelectItem>
                          <SelectItem value="B-">B-</SelectItem>
                          <SelectItem value="O+">O+</SelectItem>
                          <SelectItem value="O-">O-</SelectItem>
                          <SelectItem value="AB+">AB+</SelectItem>
                          <SelectItem value="AB-">AB-</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex flex-col gap-2">
                      <Label htmlFor="contactNumber">Contact Number</Label>
                      <Input
                        id="contactNumber"
                        name="contactNumber"
                        type="tel"
                        inputMode="tel"
                        placeholder="e.g. +8801XXXXXXXXX"
                        required
                      />
                    </div>
                    <div className="flex flex-col gap-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        inputMode="email"
                        placeholder="e.g. name@example.com"
                        required
                      />
                    </div>
                    <div className="flex flex-col gap-2">
                      <Label htmlFor="gender">Gender</Label>
                      <Select name="gender">
                        <SelectTrigger id="gender">
                          <SelectValue placeholder="Select gender" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="male">Male</SelectItem>
                          <SelectItem value="female">Female</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex flex-col gap-2 md:col-span-2">
                      <Label htmlFor="image">Profile Image</Label>
                      <div className="flex flex-col items-start gap-3">
                        <input
                          id="image"
                          name="image"
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => {
                            const file = e.target.files?.[0] ?? null;
                            setSelectedFile(file);
                          }}
                        />
                        <label
                          htmlFor="image"
                          className="w-full cursor-pointer rounded-md border-2 border-dashed border-gray-300 p-4 text-center hover:border-primary/60"
                        >
                          {previewUrl ? (
                            <div className="flex items-center gap-4">
                              <Image
                                src={previewUrl}
                                alt="Preview"
                                width={80}
                                height={80}
                                className="rounded-md object-cover"
                              />
                              <div className="text-left">
                                <p className="text-sm text-muted-foreground">
                                  Change profile image
                                </p>
                                <p className="text-xs text-gray-500">
                                  Click to select a different image
                                </p>
                              </div>
                            </div>
                          ) : (
                            <div>
                              <p className="text-sm text-muted-foreground">
                                Click to select a profile image
                              </p>
                              <p className="text-xs text-gray-500">
                                PNG, JPG up to 16MB
                              </p>
                            </div>
                          )}
                        </label>
                        {selectedFile && (
                          <div className="flex items-center gap-3">
                            <Button
                              type="button"
                              variant="secondary"
                              onClick={() =>
                                document.getElementById("image")?.click()
                              }
                            >
                              Change Image
                            </Button>
                            <Button
                              type="button"
                              variant="ghost"
                              onClick={() => setSelectedFile(null)}
                            >
                              Remove
                            </Button>
                            <span className="text-xs text-gray-500">
                              {selectedFile.name}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="md:col-span-2">
                      <Button
                        type="submit"
                        className="w-full bg-primary hover:bg-primary/90"
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? "Submitting..." : "Submit Registration"}
                      </Button>
                    </div>
                  </form>
                  <Dialog open={successOpen} onOpenChange={setSuccessOpen}>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Admission submitted</DialogTitle>
                        <DialogDescription>
                          Your admission has been submitted successfully. We
                          will contact you soon.
                        </DialogDescription>
                      </DialogHeader>
                      <div className="mt-4 flex justify-end">
                        <Button
                          onClick={() => {
                            setSuccessOpen(false);
                            router.push("/");
                          }}
                        >
                          Okay
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12"
            >
              {benefits.map((benefit, index) => (
                <Card key={index} className="bg-white">
                  <CardHeader className="flex flex-row items-center space-x-4 pb-2">
                    <benefit.icon className="h-8 w-8 text-primary" />
                    <CardTitle>{benefit.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p>{benefit.description}</p>
                  </CardContent>
                </Card>
              ))}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
              className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12"
            >
              <Card className="bg-white">
                <CardHeader>
                  <CardTitle className="text-2xl font-semibold">
                    Contact Us
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <Phone className="w-5 h-5 text-primary" />
                    <span>Main Office: :+880 1763531313</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Phone className="w-5 h-5 text-primary" />
                    <span>Admissions: +880 1234 567891</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Mail className="w-5 h-5 text-primary" />
                    <span>Email: info@rka.com</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <MapPin className="w-5 h-5 text-primary" />
                    <span>123 Karate Street, Dhaka, Bangladesh</span>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white">
                <CardHeader>
                  <CardTitle className="text-2xl font-semibold">
                    How to Join
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="mb-4">
                    To join RKA, we encourage you to visit our dojo or give us a
                    call. Our experienced staff will be happy to provide you
                    with information about our programs, class schedules, and
                    enrollment process.
                  </p>
                  <Button className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-2 px-4 rounded">
                    <Phone className="w-5 h-5 mr-2" />
                    Call Us Now
                  </Button>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.8 }}
            >
              <Card className="bg-white mb-12">
                <CardHeader>
                  <CardTitle className="text-2xl font-semibold">
                    Follow Us
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex space-x-4">
                  <Link
                    href="https://www.facebook.com/RKA"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center text-blue-600 hover:text-blue-800"
                  >
                    <Facebook className="w-6 h-6 mr-2" />
                    <span>Facebook</span>
                  </Link>
                  <Link
                    href="https://www.youtube.com/RKA"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center text-red-600 hover:text-red-800"
                  >
                    <Youtube className="w-6 h-6 mr-2" />
                    <span>YouTube</span>
                  </Link>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}
