import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Plus, Trash2, X } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { axiosInstance } from "@/api/axios";

// Schema for form validation
const formSchema = z.object({
    title: z.string().min(5, "Title must be at least 5 characters"),
    description: z.string().min(20, "Description must be at least 20 characters"),
    shortDescription: z.string().min(10, "Short description must be at least 10 characters"),
    tags: z.array(z.string()).min(1, "At least one tag is required"),
    category: z.array(z.string()).min(1, "At least one category is required"),
    price: z.number().min(0, "Price cannot be negative"),
    isFree: z.boolean(),
    level: z.enum(["beginner", "intermediate", "advanced"]),
    language: z.string().min(1, "Language is required"),
    duration: z.number().min(1, "Duration must be at least 1 minute"),
    courseThumbnail: z.string().url("Must be a valid URL"),
    prerequisites: z.array(z.string()),
    faq: z.array(
        z.object({
            question: z.string().min(5, "Question must be at least 5 characters"),
            answer: z.string().min(5, "Answer must be at least 5 characters"),
        })
    ),
    courseLink: z.array(
        z.object({
            link: z.string().url("Must be a valid URL"),
            position: z.number().min(1, "Position must be at least 1"),
        })
    ),
});

export const UploadCourse = () => {
    const [newTag, setNewTag] = useState("");
    const [newCategory, setNewCategory] = useState("");
    const [newPrerequisite, setNewPrerequisite] = useState("");
    // const [thumbnailFile, setThumbnailFile] = useState<string | null>(null);
    const [isUploading, setIsUploading] = useState(false);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            title: "Algebra Essentials for Class 10",
            description: "A comprehensive course covering linear equations, polynomials, and quadratic equations with interactive examples.",
            shortDescription: "Master core Algebra concepts for Class 10 with ease.",
            tags: ["algebra", "class10", "math", "cbse"],
            category: ["Mathematics", "Classroom"],
            price: 0,
            isFree: true,
            level: "beginner",
            language: "English",
            duration: 180,
            courseThumbnail: "https://i.ytimg.com/vi/SOME_VIDEO_ID/maxresdefault.jpg",
            prerequisites: ["Basic arithmetic", "Understanding of variables and expressions"],
            faq: [
                {
                    question: "Is this course suitable for CBSE and ICSE?",
                    answer: "Yes, it aligns with both CBSE and ICSE Class 10 syllabi."
                },
                {
                    question: "Are there practice problems included?",
                    answer: "Absolutely! Each chapter includes solved examples and quizzes."
                }
            ],
            courseLink: [
                {
                    link: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
                    position: 1
                },
                {
                    link: "https://www.youtube.com/playlist?list=PLabcd1234efg5678",
                    position: 2
                }
            ]
        }


    });

    const { control, handleSubmit, setValue, watch } = form;

    const onSubmit = async (data: z.infer<typeof formSchema>) => {
        setIsUploading(true);
        try {
            // Simulate API call
            const d = await axiosInstance.post('/api/courses', data);
            toast.success("yo ho!", {
                description: d?.data.message
            });
        } catch (error) {
            toast.error("Failed to upload course", {
                description: "Please try again later.",
            });
        } finally {
            setIsUploading(false);
        }
    };

    const handleAddTag = () => {
        if (newTag.trim() && !watch("tags").includes(newTag.trim())) {
            setValue("tags", [...watch("tags"), newTag.trim()]);
            setNewTag("");
        }
    };

    const handleRemoveTag = (tagToRemove: string) => {
        setValue(
            "tags",
            watch("tags").filter(tag => tag !== tagToRemove)
        );
    };

    const handleAddCategory = () => {
        if (newCategory.trim() && !watch("category").includes(newCategory.trim())) {
            setValue("category", [...watch("category"), newCategory.trim()]);
            setNewCategory("");
        }
    };

    const handleRemoveCategory = (categoryToRemove: string) => {
        setValue(
            "category",
            watch("category").filter(cat => cat !== categoryToRemove)
        );
    };

    const handleAddPrerequisite = () => {
        if (newPrerequisite.trim()) {
            setValue("prerequisites", [...watch("prerequisites"), newPrerequisite.trim()]);
            setNewPrerequisite("");
        }
    };

    const handleRemovePrerequisite = (prerequisiteToRemove: string) => {
        setValue(
            "prerequisites",
            watch("prerequisites").filter(pre => pre !== prerequisiteToRemove)
        );
    };

    const handleAddFAQ = () => {
        setValue("faq", [...watch("faq"), { question: "", answer: "" }]);
    };

    const handleRemoveFAQ = (index: number) => {
        const updatedFAQ = [...watch("faq")];
        updatedFAQ.splice(index, 1);
        setValue("faq", updatedFAQ);
    };

    const handleAddCourseLink = () => {
        setValue("courseLink", [...watch("courseLink"), { link: "", position: watch("courseLink").length + 1 }]);
    };

    const handleRemoveCourseLink = (index: number) => {
        const updatedLinks = [...watch("courseLink")];
        updatedLinks.splice(index, 1);
        setValue("courseLink", updatedLinks);
    };



    return (
        <div className="container mx-auto py-8 px-4 mt-10">
            <h1 className="text-3xl font-bold text-center mb-8 ">
                Upload New Course
            </h1>

            <Form {...form}>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* Left Column */}
                        <div className="space-y-6">
                            <Card>
                                <CardHeader>
                                    <CardTitle className="text-xl">Basic Information</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <FormField
                                        control={control}
                                        name="title"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Course Title</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="Enter course title" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={control}
                                        name="shortDescription"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Short Description</FormLabel>
                                                <FormControl>
                                                    <Textarea
                                                        placeholder="A brief description that appears on course cards"
                                                        rows={3}
                                                        {...field}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={control}
                                        name="description"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Full Description</FormLabel>
                                                <FormControl>
                                                    <Textarea
                                                        placeholder="Detailed description of your course"
                                                        rows={6}
                                                        {...field}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={control}
                                        name="courseThumbnail"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Course Thumbnail URL</FormLabel>
                                                <FormControl>
                                                    <div className="flex items-center gap-4">
                                                        <Input
                                                            type="url"
                                                            placeholder="https://example.com/thumbnail.jpg"
                                                            {...field}

                                                        />
                                                        {field.value && (
                                                            <div className="relative">
                                                                <img
                                                                    src={field.value}
                                                                    alt="Course thumbnail preview"
                                                                    className="h-16 w-16 rounded-md object-cover"
                                                                    onError={(e) => {
                                                                        // If image fails to load, replace with a placeholder
                                                                        (e.target as HTMLImageElement).src = "https://via.placeholder.com/1280x720";
                                                                    }}
                                                                />
                                                                <button
                                                                    type="button"
                                                                    onClick={() => {
                                                                        setValue("courseThumbnail", "");
                                                                    }}
                                                                    className="absolute -top-2 -right-2 bg-red-500 rounded-full p-1"
                                                                >
                                                                    <X className="h-3 w-3 text-white" />
                                                                </button>
                                                            </div>
                                                        )}
                                                    </div>
                                                </FormControl>
                                                <FormDescription>
                                                    Enter a direct image URL (Recommended size: 1280x720 pixels)
                                                </FormDescription>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle className="text-xl">Pricing & Settings</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <FormField
                                            control={control}
                                            name="isFree"
                                            render={({ field }) => (
                                                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                                                    <div className="space-y-0.5">
                                                        <FormLabel className="text-base">
                                                            Free Course
                                                        </FormLabel>
                                                        <FormDescription>
                                                            Enable if this course should be free
                                                        </FormDescription>
                                                    </div>
                                                    <FormControl>
                                                        <Switch
                                                            checked={field.value}
                                                            onCheckedChange={field.onChange}
                                                        />
                                                    </FormControl>
                                                </FormItem>
                                            )}
                                        />
                                    </div>

                                    {!watch("isFree") && (
                                        <FormField
                                            control={control}
                                            name="price"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Price (INR)</FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            type="number"
                                                            min="0"
                                                            step="1"
                                                            placeholder="₹ 99 /-"
                                                            {...field}
                                                            onChange={e => field.onChange(parseFloat(e.target.value))}
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    )}

                                    <div className="grid grid-cols-2 gap-4">
                                        <FormField
                                            control={control}
                                            name="level"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Difficulty Level</FormLabel>
                                                    <Select
                                                        onValueChange={field.onChange}
                                                        defaultValue={field.value}
                                                    >
                                                        <FormControl>
                                                            <SelectTrigger>
                                                                <SelectValue placeholder="Select level" />
                                                            </SelectTrigger>
                                                        </FormControl>
                                                        <SelectContent>
                                                            <SelectItem value="beginner">Beginner</SelectItem>
                                                            <SelectItem value="intermediate">
                                                                Intermediate
                                                            </SelectItem>
                                                            <SelectItem value="advanced">Advanced</SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />

                                        <FormField
                                            control={control}
                                            name="language"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Language</FormLabel>
                                                    <FormControl>
                                                        <Input placeholder="English" {...field} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>

                                    <FormField
                                        control={control}
                                        name="duration"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Duration (minutes)</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        type="number"
                                                        min="1"
                                                        placeholder="300"
                                                        {...field}
                                                        onChange={e => field.onChange(parseInt(e.target.value))}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </CardContent>
                            </Card>
                        </div>

                        {/* Right Column */}
                        <div className="space-y-6">
                            <Card>
                                <CardHeader>
                                    <CardTitle className="text-xl">Tags & Categories</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div>
                                        <FormLabel>Tags</FormLabel>
                                        <div className="flex gap-2 mb-2">
                                            <Input
                                                value={newTag}
                                                onChange={e => setNewTag(e.target.value)}
                                                placeholder="Add a tag"
                                                onKeyDown={e => {
                                                    if (e.key === "Enter") {
                                                        e.preventDefault();
                                                        handleAddTag();
                                                    }
                                                }}
                                            />
                                            <Button
                                                type="button"
                                                variant="outline"
                                                size="sm"
                                                onClick={handleAddTag}
                                            >
                                                <Plus className="h-4 w-4" />
                                            </Button>
                                        </div>
                                        <div className="flex flex-wrap gap-2">
                                            {watch("tags").map(tag => (
                                                <Badge
                                                    key={tag}
                                                    variant="secondary"
                                                    className="flex items-center gap-1"
                                                >
                                                    {tag}
                                                    <button
                                                        type="button"
                                                        onClick={() => handleRemoveTag(tag)}
                                                        className="text-muted-foreground hover:text-foreground"
                                                    >
                                                        <X className="h-3 w-3" />
                                                    </button>
                                                </Badge>
                                            ))}
                                        </div>
                                        <FormMessage>
                                            {form.formState.errors.tags?.message}
                                        </FormMessage>
                                    </div>

                                    <div>
                                        <FormLabel>Categories</FormLabel>
                                        <div className="flex gap-2 mb-2">
                                            <Input
                                                value={newCategory}
                                                onChange={e => setNewCategory(e.target.value)}
                                                placeholder="Add a category"
                                                onKeyDown={e => {
                                                    if (e.key === "Enter") {
                                                        e.preventDefault();
                                                        handleAddCategory();
                                                    }
                                                }}
                                            />
                                            <Button
                                                type="button"
                                                variant="outline"
                                                size="sm"
                                                onClick={handleAddCategory}
                                            >
                                                <Plus className="h-4 w-4" />
                                            </Button>
                                        </div>
                                        <div className="flex flex-wrap gap-2">
                                            {watch("category").map(cat => (
                                                <Badge
                                                    key={cat}
                                                    variant="secondary"
                                                    className="flex items-center gap-1"
                                                >
                                                    {cat}
                                                    <button
                                                        type="button"
                                                        onClick={() => handleRemoveCategory(cat)}
                                                        className="text-muted-foreground hover:text-foreground"
                                                    >
                                                        <X className="h-3 w-3" />
                                                    </button>
                                                </Badge>
                                            ))}
                                        </div>
                                        <FormMessage>
                                            {form.formState.errors.category?.message}
                                        </FormMessage>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle className="text-xl">Prerequisites</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div>
                                        <div className="flex gap-2 mb-2">
                                            <Input
                                                value={newPrerequisite}
                                                onChange={e => setNewPrerequisite(e.target.value)}
                                                placeholder="Add a prerequisite"
                                                onKeyDown={e => {
                                                    if (e.key === "Enter") {
                                                        e.preventDefault();
                                                        handleAddPrerequisite();
                                                    }
                                                }}
                                            />
                                            <Button
                                                type="button"
                                                variant="outline"
                                                size="sm"
                                                onClick={handleAddPrerequisite}
                                            >
                                                <Plus className="h-4 w-4" />
                                            </Button>
                                        </div>
                                        <ul className="space-y-2">
                                            {watch("prerequisites").map((pre, index) => (
                                                <li
                                                    key={index}
                                                    className="flex items-center justify-between p-2 bg-secondary/50 rounded"
                                                >
                                                    <span>{pre}</span>
                                                    <button
                                                        type="button"
                                                        onClick={() => handleRemovePrerequisite(pre)}
                                                        className="text-red-500 hover:text-red-700"
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </button>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle className="text-xl">FAQ</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        size="sm"
                                        className="mb-4"
                                        onClick={handleAddFAQ}
                                    >
                                        <Plus className="h-4 w-4 mr-2" />
                                        Add FAQ Item
                                    </Button>

                                    <div className="space-y-4">
                                        {watch("faq").map((_, index) => (
                                            <div key={index} className="space-y-2">
                                                <div className="flex justify-between items-center">
                                                    <h3 className="font-medium">FAQ #{index + 1}</h3>
                                                    <button
                                                        type="button"
                                                        onClick={() => handleRemoveFAQ(index)}
                                                        className="text-red-500 hover:text-red-700"
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </button>
                                                </div>
                                                <FormField
                                                    control={control}
                                                    name={`faq.${index}.question`}
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormControl>
                                                                <Input
                                                                    placeholder="Question"
                                                                    {...field}
                                                                />
                                                            </FormControl>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                                <FormField
                                                    control={control}
                                                    name={`faq.${index}.answer`}
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormControl>
                                                                <Textarea
                                                                    placeholder="Answer"
                                                                    rows={3}
                                                                    {...field}
                                                                />
                                                            </FormControl>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                                <Separator className="my-2" />
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle className="text-xl">Course Links</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        size="sm"
                                        className="mb-4"
                                        onClick={handleAddCourseLink}
                                    >
                                        <Plus className="h-4 w-4 mr-2" />
                                        Add Link
                                    </Button>

                                    <div className="space-y-4">
                                        {watch("courseLink").map((_, index) => (
                                            <div key={index} className="space-y-2">
                                                <div className="flex justify-between items-center">
                                                    <h3 className="font-medium">Link #{index + 1}</h3>
                                                    <button
                                                        type="button"
                                                        onClick={() => handleRemoveCourseLink(index)}
                                                        className="text-red-500 hover:text-red-700"
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </button>
                                                </div>
                                                <FormField
                                                    control={control}
                                                    name={`courseLink.${index}.link`}
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormLabel>URL</FormLabel>
                                                            <FormControl>
                                                                <Input
                                                                    placeholder="https://example.com"
                                                                    {...field}
                                                                />
                                                            </FormControl>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                                <FormField
                                                    control={control}
                                                    name={`courseLink.${index}.position`}
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormLabel>Position</FormLabel>
                                                            <FormControl>
                                                                <Input
                                                                    type="number"
                                                                    min="1"
                                                                    {...field}
                                                                    onChange={e =>
                                                                        field.onChange(parseInt(e.target.value))
                                                                    }
                                                                />
                                                            </FormControl>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                                <Separator className="my-2" />
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>

                    <div className="flex justify-end">
                        <Button
                            type="submit"
                            size="lg"
                            className="px-8"
                            disabled={isUploading}
                        >
                            {isUploading ? (
                                <>
                                    <svg
                                        className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                    >
                                        <circle
                                            className="opacity-25"
                                            cx="12"
                                            cy="12"
                                            r="10"
                                            stroke="currentColor"
                                            strokeWidth="4"
                                        ></circle>
                                        <path
                                            className="opacity-75"
                                            fill="currentColor"
                                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                        ></path>
                                    </svg>
                                    Uploading...
                                </>
                            ) : (
                                "Upload Course"
                            )}
                        </Button>
                    </div>
                </form>
            </Form>
        </div>
    );
};