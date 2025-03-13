"use client"
import React, { useState } from "react"
import { useStore } from "@/store"
import { ModalWrapper } from "@/components/ui/modal-wrapper"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"

export function CreatePostModal() {
  const { toast } = useToast()
  const { user } = useStore.getState().profile

  const [formData, setFormData] = useState({
    title: "",
    content: "",
    imageUrls: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return

    setIsSubmitting(true)
    try {
      // Convert comma-separated image URLs to array
      const imageList = formData.imageUrls ? formData.imageUrls.split(",").map((url) => url.trim()) : []

      await createPost({
        title: formData.title,
        content: formData.content,
        authorId: user.id,
        authorName: user.fullname,
        imageList,
      })

      toast({
        title: "Success",
        description: "Post created successfully",
      })
      closeModal("createPost")
      // Reset form
      setFormData({
        title: "",
        content: "",
        imageUrls: "",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create post",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <ModalWrapper
      title="Create New Post"
      description="Share information with your patients"
      isOpen={modals.createPost}
      onClose={() => closeModal("createPost")}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="title">Title</Label>
          <Input id="title" name="title" value={formData.title} onChange={handleChange} required />
        </div>

        <div className="space-y-2">
          <Label htmlFor="content">Content</Label>
          <Textarea id="content" name="content" rows={6} value={formData.content} onChange={handleChange} required />
        </div>

        <div className="space-y-2">
          <Label htmlFor="imageUrls">Image URLs (comma-separated, optional)</Label>
          <Input
            id="imageUrls"
            name="imageUrls"
            value={formData.imageUrls}
            onChange={handleChange}
            placeholder="https://example.com/image1.jpg, https://example.com/image2.jpg"
          />
          <p className="text-xs text-muted-foreground">Enter URLs separated by commas</p>
        </div>

        <div className="flex justify-end space-x-2 pt-4">
          <Button type="button" variant="outline" onClick={() => closeModal("createPost")}>
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Creating..." : "Create Post"}
          </Button>
        </div>
      </form>
    </ModalWrapper>
  )
}

