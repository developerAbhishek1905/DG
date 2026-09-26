  import { RotateCcw } from "lucide-react";
  // import { useEffect, useState } from "react"; 
  import { useEffect, useRef, useState } from "react";
  import { getCategoryDropdown } from "../../categoryMaster/services/categoryApi";
  import { getProducts } from "../../productMaster";
  import { searchCities } from "../services/addressApi";

  import SearchSelect, {
    type SearchSelectOption,
  } from "../../../components/ui/SearchSelect";

  interface Props {
    search: string;
    status: string;

    cityId: string;
    categoryId: string;
    productId: string;

    onSearchChange: (value: string) => void;
    onStatusChange: (value: string) => void;

    onCityChange: (value: string) => void;
    onCategoryChange: (value: string) => void;
    onProductChange: (value: string) => void;

    onClearFilters: () => void;
  }

  export default function DealerFilters({
    search,
    status,

    cityId,
    categoryId,
    productId,

    onSearchChange,
    onStatusChange,

    onCityChange,
    onCategoryChange,
    onProductChange,

    onClearFilters,
  }: Props) {
    const [cities, setCities] = useState<SearchSelectOption[]>([]);
    const [categories, setCategories] = useState<SearchSelectOption[]>([]);
    const [products, setProducts] = useState<SearchSelectOption[]>([]);
    // const [categorySearch, setCategorySearch] = useState("");
    // const [productSearch, setProductSearch] = useState("");
    const [cityLoading, setCityLoading] = useState(false);
    const [categoryLoading, setCategoryLoading] = useState(false);
    const [productLoading, setProductLoading] = useState(false);

    const [citySearch, setCitySearch] = useState("");
  const cityRequestRef = useRef(0);
    /*
    |--------------------------------------------------------------------------
    | City Search
    |--------------------------------------------------------------------------
    */

  useEffect(() => {
    const timer = setTimeout(async () => {
      const requestId = ++cityRequestRef.current;

      try {
        setCityLoading(true);

        const response = await searchCities({
          search: citySearch,
        });

        // Agar ye old request ka response hai to ignore karo
        if (requestId !== cityRequestRef.current) {
          return;
        }

        setCities(
          response.map((city) => ({
            value: city.city_id,
            label: city.city_name,
            data: city,
          })),
        );
      } catch (error) {
        if (requestId !== cityRequestRef.current) {
          return;
        }

        console.error("Failed to search cities:", error);
        setCities([]);
      } finally {
        if (requestId === cityRequestRef.current) {
          setCityLoading(false);
        }
      }
    }, 400);

    return () => {
      clearTimeout(timer);
    };
  }, [citySearch]);
    /*
    |--------------------------------------------------------------------------
    | Categories
    |--------------------------------------------------------------------------
    */

  useEffect(() => {
    const loadCategories = async () => {
      try {
        setCategoryLoading(true);

        const response = await getCategoryDropdown();

        setCategories(
          response.map((item) => ({
            value: item._id,
            label: `${item.category} - ${item.description}`,
            data: item,
          })),
        );
      } catch (error) {
        console.error("Failed to load categories:", error);
        setCategories([]);
      } finally {
        setCategoryLoading(false);
      }
    };

    loadCategories();
  }, []);

    /*
    |--------------------------------------------------------------------------
    | Products
    |--------------------------------------------------------------------------
    */

  useEffect(() => {
    const loadProducts = async () => {
      try {
        setProductLoading(true);

        const response = await getProducts({
          page: 1,
          limit: 1000,
          status: "ACTIVE",
        });

        setProducts(
          (response.data ?? []).map((product) => ({
            value: product.product_id,
            label: product.product_name,
            data: product,
          })),
        );
      } catch (error) {
        console.error("Failed to load products:", error);
        setProducts([]);
      } finally {
        setProductLoading(false);
      }
    };

    loadProducts();
  }, []);
    /*
    |--------------------------------------------------------------------------
    | Selected Labels
    |--------------------------------------------------------------------------
    */

    const selectedCity =
      cities.find((item) => String(item.value) === String(cityId))?.label ?? "";

    const selectedCategory =
      categories.find((item) => String(item.value) === String(categoryId))
        ?.label ?? "";

    const selectedProduct =
      products.find((item) => String(item.value) === String(productId))?.label ??
      "";

    /*
    |--------------------------------------------------------------------------
    | Clear
    |--------------------------------------------------------------------------
    */

    const handleClear = () => {
      setCitySearch("");
      onClearFilters();
    };
  // const handleClear = () => {
  //   setCitySearch("");
  //   setCategorySearch("");
  //   setProductSearch("");

  //   onClearFilters();
  // };

    const hasFilters =
      search || status !== "ALL" || cityId || categoryId || productId;

    return (
      <div className="rounded-xl border border-gray-200 bg-white p-4">
        <div
          className="
            grid items-end gap-3
            md:grid-cols-2
            lg:grid-cols-[2fr_1fr_1.4fr_1fr_1fr_auto]
          "
        >
          {/* Search */}

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Search
            </label>

            <input
              type="text"
              value={search}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Head code, dealer, technician, mobile..."
              className="
                h-8 w-full rounded-md border border-gray-300
                bg-white px-3
                text-sm text-gray-700
                outline-none transition
                placeholder:text-gray-400
                focus:border-blue-500
                focus:ring-1
                focus:ring-blue-100
              "
            />
          </div>

          {/* City */}

          <SearchSelect
            label="City"
            value={selectedCity}
            placeholder="Search city..."
            options={cities}
            loading={cityLoading}
            onSearch={(value) => {
              setCitySearch(value);
            }}
            onSelect={(option) => {
              onCityChange(String(option.value));
            }}
            onClear={() => {
              onCityChange("");
              setCitySearch("");
            }}
          />

          {/* Category */}
          {/* 
          <SearchSelect
            label="Category"
            value={selectedCategory}
            placeholder="Select category"
            options={categories}
            loading={categoryLoading}
            onSelect={(option) => {
              onCategoryChange(String(option.value));
            }}
            onClear={() => {
              onCategoryChange("");
            }}
          /> */}

  <SearchSelect
    label="Category"
    value={selectedCategory}
    placeholder="Search category..."
    options={categories}
    loading={categoryLoading}
    onSelect={(option) => {
      onCategoryChange(String(option.value));
    }}
    onClear={() => {
      onCategoryChange("");
    }}
  />
          {/* Product */}

          {/* <SearchSelect
            label="Product"
            value={selectedProduct}
            placeholder="Select product"
            options={products}
            loading={productLoading}
            onSelect={(option) => {
              onProductChange(String(option.value));
            }}
            onClear={() => {
              onProductChange("");
            }}
          /> */}

  <SearchSelect
    label="Product"
    value={selectedProduct}
    placeholder="Search product..."
    options={products}
    loading={productLoading}
    onSelect={(option) => {
      onProductChange(String(option.value));
    }}
    onClear={() => {
      onProductChange("");
    }}
  />

          {/* Status */}

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Status
            </label>

            <select
              value={status}
              onChange={(e) => onStatusChange(e.target.value)}
              className="
                h-8 w-full rounded-md border border-gray-300
                bg-white px-3
                text-sm text-gray-700
                outline-none transition
                focus:border-blue-500
                focus:ring-1
                focus:ring-blue-100
              "
            >
              <option value="ALL">All Status</option>
              <option value="ACTIVE">Active</option>
              <option value="INACTIVE">Inactive</option>
              <option value="SUSPENDED">Suspended</option>
            </select>
          </div>

          {/* Clear */}

          <button
            type="button"
            onClick={handleClear}
            disabled={!hasFilters}
            className="
              inline-flex h-8 items-center justify-center
              gap-1.5 whitespace-nowrap
              rounded-md border border-gray-300
              bg-white px-3
              text-sm font-medium text-gray-600
              transition
              hover:border-red-300
              hover:bg-red-50
              hover:text-red-600
              disabled:cursor-not-allowed
              disabled:opacity-40
            "
            title="Clear all filters"
          >
            <RotateCcw size={15} />
            Clear
          </button>
        </div>
      </div>
    );
  }
