"use client"
import { useState, useEffect, useCallback } from "react"
import type { ColumnDef } from "@tanstack/react-table"
import { Edit, Trash2, Plus, Tag } from "lucide-react"
import { useStore } from "@/store"
import { DataTable } from "@/components/ui/data-table"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import type { Category } from "@/types/category"
import { CategoryModal } from "@/components/modals/CategoryModal"
import Image from "next/image"

export default function CategoriesPage() {
  const { fetchCategories, deleteCategory } = useStore.getState()
  const { toast } = useToast()

  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null)

  // Load categories
  const loadCategories = useCallback(async () => {
    try {
      setLoading(true)
      const data = await fetchCategories()
      // data is an array of Category objects (each may have subCategories)
      setCategories(data)
    } catch (error: unknown) {
      const msg = error instanceof Error ? error.message : "Failed to load category"
      toast({
        title: "Error",
        description: msg,
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }, [fetchCategories, toast])

  useEffect(() => {
    loadCategories()
  }, [loadCategories])

  // Edit Category
  const handleEdit = (category: Category) => {
    setSelectedCategory(category)
    setIsCategoryModalOpen(true)
  }

  // Delete Category
  const handleDelete = async (category: Category) => {
    try {
      await deleteCategory(category.id)
      toast({
        title: "Success",
        description: "Category deleted successfully",
      })
      await loadCategories()
    } catch (error: unknown) {
      const msg = error instanceof Error ? error.message : "Failed to delete category"
      toast({
        title: "Error",
        description: msg,
        variant: "destructive",
      })
    }
  }

  // Create Category
  const handleCreate = () => {
    setSelectedCategory(null)
    setIsCategoryModalOpen(true)
  }

  // Table columns
  const columns: ColumnDef<Category>[] = [
    {
      accessorKey: "id",
      header: "ID",
    },
    {
      accessorKey: "imageName",
      header: "Image",
      cell: ({ row }) => {
        const imageName = row.getValue("imageName") as string
        return (
          <div className="flex items-center">
            <div className="h-10 w-10 overflow-hidden rounded-md border">
              <Image
                src={
                  imageName?.includes("http")
                    ? imageName
                    : "/images/placeholder.webp"
                }
                alt={`${row.getValue("name")} image`}
                width={40}
                height={40}
                className="h-full w-full object-cover"
              />
            </div>
          </div>
        )
      },
    },
    {
      accessorKey: "name",
      header: "Name",
    },
    {
      // NEW COLUMN: Show subcategories (one level deep)
      id: "subCategories",
      header: "Subcategories",
      cell: ({ row }) => {
        const subCats = row.original.subCategories
        if (!subCats || subCats.length === 0) {
          return <span>None</span>
        }
        return (
          <ul className="list-disc pl-5">
            {subCats.map((sc) => (
              <li key={sc.id}>{sc.name}</li>
            ))}
          </ul>
        )
      },
    },
    {
      accessorKey: "isActive",
      header: "Status",
      cell: ({ row }) => {
        const isActive = row.getValue("isActive") as boolean
        return (
          <Badge variant={isActive ? "default" : "secondary"}>
            {isActive ? "Active" : "Inactive"}
          </Badge>
        )
      },
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const category = row.original
        return (
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => handleEdit(category)}>
              <Edit className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleDelete(category)}
              className="text-red-500 hover:text-red-700"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        )
      },
    },
  ]

  return (
    <div className="space-y-4">
      {/* Header + Add Button */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Categories Management</h1>
        <Button onClick={handleCreate}>
          <Plus className="mr-2 h-4 w-4" />
          Add Category
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Categories</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <Tag className="mr-2 h-5 w-5 text-blue-600" />
              <div className="text-2xl font-bold">{categories.length}</div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Active Categories</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <Tag className="mr-2 h-5 w-5 text-green-600" />
              <div className="text-2xl font-bold">
                {categories.filter((c) => c.isActive).length}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Inactive Categories</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <Tag className="mr-2 h-5 w-5 text-gray-600" />
              <div className="text-2xl font-bold">
                {categories.filter((c) => !c.isActive).length}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Categories</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex h-40 items-center justify-center">
              <p>Loading categories...</p>
            </div>
          ) : (
            <DataTable
              columns={columns}
              data={categories}
              searchColumn="name"
              searchPlaceholder="Search by name..."
            />
          )}
        </CardContent>
      </Card>

      {/* Category Modal */}
      {isCategoryModalOpen && (
        <CategoryModal
          onClose={async () => {
            setIsCategoryModalOpen(false)
            await loadCategories()
          }}
          category={selectedCategory || undefined}
        />
      )}
    </div>
  )
}
