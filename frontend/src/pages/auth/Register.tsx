import { useState, type FormEvent } from "react";
import { toast } from "sonner";
import { FaRegBuilding } from "react-icons/fa";
import { FiUser, FiPhone, FiLock } from "react-icons/fi";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Link } from "react-router-dom";
import axios from "axios";

type FormData = {
    name: string;
    phone: string;
    password: string;
    school: string;
    class: string;
    stream: string;
};

export default function Register() {
    const [isLoading, setIsLoading] = useState(false);
    const [selectedClass, setSelectedClass] = useState<string>("");
    const [formData, setFormData] = useState<FormData>({
        name: "",
        phone: "",
        password: "",
        school: "",
        class: "",
        stream: "",
    });

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();

        if (!formData.class || formData.class === "") {
            toast.error("please enter the class")
            return;
        }
       if (Number(formData.class) > 10 && (!formData.stream || formData.stream.trim() === "")) {
  toast.error("Please select the stream");
  return;
}

        setIsLoading(true);
       
        try {
            console.log("Form Data:", formData);

            const {data}: { data:{success: boolean, message:string}} = await axios.post(
                "https://base-academy-backend.vercel.app/register",
                {
                    ...formData,
                    classes: formData.class,
                },
                {
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            );

            toast.success(data.message || "Registration successful! Please verify your email.");
        } catch (error: unknown) {
            if (axios.isAxiosError(error)) {
                const errorMessage = error.response?.data?.message || "An error occurred during registration";
                toast.error(errorMessage);
            } else {
                toast.error("Unexpected error occurred");
            }
        } finally {
            setIsLoading(false);
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleClassChange = (value: string) => {
        setSelectedClass(value);
        setFormData((prev) => ({
            ...prev,
            class: value,
            stream: parseInt(value) <= 10 ? "" : prev.stream,
        }));
    };

    const handleStreamChange = (value: string) => {
        setFormData((prev) => ({
            ...prev,
            stream: value,
        }));
    };

    return (
        <div className="max-w-md mx-auto p-6 space-y-6 mt-10">
            <div className="text-center">
                <h1 className="text-2xl font-bold">Create an account</h1>
                <p className="text-muted-foreground">Join Base Academy today</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
                {/* Name */}
                <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <div className="relative">
                        <FiUser className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                        <Input
                            id="name"
                            name="name"
                            type="text"
                            required
                            value={formData.name}
                            onChange={handleInputChange}
                            placeholder="Himanshu Ahuja"
                            className="pl-10"
                        />
                    </div>
                </div>

                {/* Phone */}
                <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <div className="relative">
                        <FiPhone className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                        <Input
                            id="phone"
                            name="phone"
                            type="tel"
                            required
                            value={formData.phone}
                            onChange={handleInputChange}
                            placeholder="+91 9999999999"
                            className="pl-10"
                        />
                    </div>
                </div>

                {/* Password */}
                <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <div className="relative">
                        <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                        <Input
                            id="password"
                            name="password"
                            type="password"
                            required
                            minLength={6}
                            value={formData.password}
                            onChange={handleInputChange}
                            placeholder="••••••••"
                            className="pl-10"
                        />
                    </div>
                </div>

                {/* School */}
                <div className="space-y-2">
                    <Label htmlFor="school">School</Label>
                    <div className="relative">
                        <FaRegBuilding className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                        <Input
                            id="school"
                            name="school"
                            type="text"
                            required
                            value={formData.school}
                            onChange={handleInputChange}
                            placeholder="Your school name"
                            className="pl-10"
                        />
                    </div>
                </div>

                {/* Class */}
                <div className="space-y-2">
                    <Label htmlFor="class">Class</Label>
                    <Select
                        required
                        value={selectedClass}
                        onValueChange={handleClassChange}
                    >
                        <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select your class" />
                        </SelectTrigger>
                        <SelectContent>
                            {Array.from({ length: 7 }, (_, i) => i + 6).map((grade) => (
                                <SelectItem key={grade} value={grade.toString()}>
                                    Class {grade}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                {/* Stream */}
                {selectedClass && parseInt(selectedClass) > 10 && (
                    <div className="space-y-2">
                        <Label htmlFor="stream">Stream</Label>
                        <Select
                            required
                            value={formData.stream}
                            onValueChange={handleStreamChange}
                        >
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Select your stream" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Science">Science</SelectItem>
                                <SelectItem value="Commerce">Commerce</SelectItem>
                                <SelectItem value="Arts">Arts</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                )}

                <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? "Registering..." : "Register"}
                </Button>
            </form>

            <div className="text-center text-sm text-muted-foreground">
                Already have an account?{" "}
                <Link to="/login" className="text-blue-500 hover:underline">
                    Login here
                </Link>
            </div>
        </div>
    );
}
