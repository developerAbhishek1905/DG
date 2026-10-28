import { MapPin, Plus, Trash2, X } from "lucide-react";
import ClosureMasterModal from "./ClosureMasterModal";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

import SearchSelect from "../../../components/ui/SearchSelect";
import { searchCities, type CityOption } from "../services/addressApi";
import {
  searchProducts,
  type ProductDropdownOption,
} from "../services/dealerApi";
import type {
  DealerAdditionalCity,
  DealerProductCategory,
} from "../types/dealer.types";
import ProductServicesModal from "./ProductServicesModal";

interface Props {
  value: DealerAdditionalCity[];
  onChange: (value: DealerAdditionalCity[]) => void;
  primaryCityId?: number | string | null;
}

const emptyCity = (): DealerAdditionalCity => ({
  cityId: undefined,
  city: "",
  productServices: [
    { productId: undefined, productName: "", categories: [], closures: [] },
  ],
  combinedCapacity: { products: [], capacity: 0 },
  individualCapacities: [],
});

const inputClass =
  "h-8 w-full rounded-md border border-gray-300 bg-white px-2 text-xs outline-none transition focus:border-blue-500 focus:ring-1 focus:ring-blue-100 disabled:bg-gray-100";

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-md border border-gray-200 bg-white">
      <div className="border-b border-gray-100 bg-gray-50 px-3 py-1.5">
        <h3 className="text-xs font-semibold uppercase tracking-wide text-gray-700">
          {title}
        </h3>
      </div>

      <div className="p-2.5">{children}</div>
    </section>
  );
}

/*
 * Other cities a dealer works in. Each city is filled exactly like the
 * primary city: product & service information, combined capacity and
 * individual capacity.
 */
export default function AdditionalCitiesSection({
  value,
  onChange,
  primaryCityId,
}: Props) {
  const [cities, setCities] = useState<CityOption[]>([]);
  const [citiesLoading, setCitiesLoading] = useState(false);

  const [products, setProducts] = useState<ProductDropdownOption[]>([]);
  const [productsLoading, setProductsLoading] = useState(false);

  const [servicesModal, setServicesModal] = useState<{
    cityIndex: number;
    productIndex: number;
  } | null>(null);

  const [closureModal, setClosureModal] = useState<{
    cityIndex: number;
    productIndex: number;
  } | null>(null);

  const loadCities = async (search = "") => {
    try {
      setCitiesLoading(true);
      setCities(await searchCities({ search }));
    } catch {
      setCities([]);
    } finally {
      setCitiesLoading(false);
    }
  };

  const loadProducts = async (search = "") => {
    try {
      setProductsLoading(true);
      setProducts(await searchProducts(search));
    } catch {
      setProducts([]);
    } finally {
      setProductsLoading(false);
    }
  };

  useEffect(() => {
    loadCities("");
    loadProducts("");
  }, []);

  const updateCity = (index: number, patch: Partial<DealerAdditionalCity>) =>
    onChange(
      value.map((item, i) => (i === index ? { ...item, ...patch } : item)),
    );

  const takenCityIds = new Set<number>(
    [primaryCityId, ...value.map((item) => item.cityId)]
      .filter((id) => id !== undefined && id !== null && id !== "")
      .map(Number),
  );

  const productOptions = (exclude: (number | undefined)[] = []) =>
    products
      .filter((p) => !exclude.includes(p.product_id))
      .map((p) => ({ value: p.product_id, label: p.product_name, data: p }));

  return (
    <div className="mt-6 border-t border-gray-200 pt-5">
      <div className="mb-1 flex items-center gap-2">
        <MapPin size={18} className="text-[#123B7A]" />

        <h3 className="text-base font-semibold text-gray-900">
          Other Operating Cities
        </h3>
      </div>

      <p className="mb-4 text-xs text-gray-500">
        Add every other city this dealer works in. Fill each one exactly like
        the primary city above.
      </p>

      <div className="space-y-6">
        {value.map((city, index) => {
          const combinedIds = city.combinedCapacity.products.map(
            (p) => p.productId,
          );

          const services = city.productServices;

          const setServices = (next: typeof services) =>
            updateCity(index, { productServices: next });

          const setIndividual = (next: typeof city.individualCapacities) =>
            updateCity(index, { individualCapacities: next });

          return (
            <div
              key={index}
              className="rounded-xl border-2 border-blue-100 bg-blue-50/30 p-3"
            >
              {/* CITY HEADER */}

              <div className="mb-3 flex items-end justify-between gap-3">
                <div className="w-full max-w-sm">
                  <SearchSelect
                    label={`City ${index + 2}`}
                    required
                    value={city.city}
                    placeholder="Search city..."
                    loading={citiesLoading}
                    filterMode="server"
                    options={cities
                      .filter(
                        (c) =>
                          !takenCityIds.has(Number(c.city_id)) ||
                          c.city_id === city.cityId,
                      )
                      .map((c) => ({
                        value: c.city_id,
                        label: c.district_name
                          ? `${c.city_name}, ${c.district_name}`
                          : c.city_name,
                        data: c,
                      }))}
                    onSearch={loadCities}
                    onSelect={(option) => {
                      const c = option.data as CityOption;

                      updateCity(index, {
                        cityId: Number(c.city_id),
                        city: c.city_name,
                      });
                    }}
                    onClear={() =>
                      updateCity(index, { cityId: undefined, city: "" })
                    }
                  />
                </div>

                <button
                  type="button"
                  onClick={() => onChange(value.filter((_, i) => i !== index))}
                  className="inline-flex h-8 items-center gap-1.5 rounded-md border border-red-200 bg-white px-3 text-xs font-medium text-red-600 hover:bg-red-50"
                >
                  <Trash2 size={14} />
                  Remove city
                </button>
              </div>

              <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
                {/* ================= PRODUCT & SERVICE ================= */}

                <Section title="Product & Service Information">
                  <div className="space-y-2">
                    {services.map((item, pIndex) => (
                      <div
                        key={pIndex}
                        className="rounded-lg border border-gray-200 bg-gray-50/50 p-2.5"
                      >
                        <div className="grid grid-cols-[minmax(0,1fr)_auto_auto_auto] items-end gap-2">
                          <SearchSelect
                            label={`Product ${pIndex + 1}`}
                            value={item.productName}
                            placeholder="Search product..."
                            loading={productsLoading}
                            options={productOptions()}
                            onSearch={loadProducts}
                            onSelect={(option) => {
                              const product =
                                option.data as ProductDropdownOption;

                              if (
                                services.some(
                                  (s, i) =>
                                    i !== pIndex &&
                                    s.productId === product.product_id,
                                )
                              ) {
                                toast.error(
                                  "This product is already selected.",
                                );
                                return;
                              }

                              setServices(
                                services.map((s, i) =>
                                  i === pIndex
                                    ? {
                                        productId: product.product_id,
                                        productName: product.product_name,
                                        categories: [],
                                        closures: [],
                                      }
                                    : s,
                                ),
                              );
                            }}
                            onClear={() =>
                              setServices(
                                services.map((s, i) =>
                                  i === pIndex
                                    ? {
                                        productId: undefined,
                                        productName: "",
                                        categories: [],
                                        closures: [],
                                      }
                                    : s,
                                ),
                              )
                            }
                          />

                          <button
                            type="button"
                            disabled={!item.productId}
                            onClick={() =>
                              setServicesModal({
                                cityIndex: index,
                                productIndex: pIndex,
                              })
                            }
                            className="h-8 whitespace-nowrap rounded-md bg-blue-600 px-3 text-xs font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-gray-300"
                          >
                            Services
                          </button>

                          <button
                            type="button"
                            disabled={!item.productId}
                            onClick={() =>
                              setClosureModal({
                                cityIndex: index,
                                productIndex: pIndex,
                              })
                            }
                            className="h-8 whitespace-nowrap rounded-md bg-emerald-600 px-3 text-xs font-medium text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:bg-gray-300"
                          >
                            Closure
                          </button>

                          <button
                            type="button"
                            disabled={services.length === 1}
                            onClick={() =>
                              setServices(
                                services.filter((_, i) => i !== pIndex),
                              )
                            }
                            className="flex h-8 w-8 items-center justify-center rounded-md border border-red-200 bg-white text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-40"
                            title="Remove product"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>

                        {item.categories.length > 0 && (
                          <div className="mt-2 flex flex-wrap items-center gap-1.5">
                            <span className="mr-1 text-[10px] font-medium text-gray-500">
                              Services:
                            </span>

                            {item.categories.map((category, cIndex) => (
                              <div
                                key={category.categoryId}
                                className="flex items-center gap-1 rounded-md border border-blue-200 bg-blue-50 px-2 py-1 text-[10px] font-medium text-blue-700"
                              >
                                <span>
                                  {category.categoryName}

                                  {category.rate > 0 && (
                                    <span className="ml-1 font-semibold">
                                      ₹{category.rate}
                                    </span>
                                  )}
                                </span>

                                <button
                                  type="button"
                                  onClick={() =>
                                    setServices(
                                      services.map((s, i) =>
                                        i === pIndex
                                          ? {
                                              ...s,
                                              categories: s.categories.filter(
                                                (_, k) => k !== cIndex,
                                              ),
                                            }
                                          : s,
                                      ),
                                    )
                                  }
                                  className="ml-0.5 text-blue-400 hover:text-red-600"
                                  title="Remove service"
                                >
                                  ×
                                </button>
                              </div>
                            ))}
                          </div>
                        )}

                        {(item.closures?.length ?? 0) > 0 && (
                          <div className="mt-2 flex flex-wrap items-center gap-1.5">
                            <span className="mr-1 text-[10px] font-medium text-gray-500">
                              Closures:
                            </span>

                            {item.closures?.map((closure) => (
                              <div
                                key={closure.closureId}
                                className="flex items-center gap-1 rounded-md border border-emerald-200 bg-emerald-50 px-2 py-1 text-[10px] font-medium text-emerald-700"
                              >
                                <span>
                        {closure.title}
                        {closure.rate > 0 && (
                          <span className="ml-1 font-semibold">₹{closure.rate}</span>
                        )}
                        {closure.defaultBill && (
                          <span className="ml-1 rounded bg-emerald-600 px-1 text-[9px] font-semibold text-white">
                            DEFAULT BILL
                          </span>
                        )}
                        {closure.autoBill && (
                          <span className="ml-1 rounded bg-blue-600 px-1 text-[9px] font-semibold text-white">
                            AUTO BILL
                          </span>
                        )}
                      </span>

                                <button
                                  type="button"
                                  onClick={() =>
                                    setServices(
                                      services.map((s, i) =>
                                        i === pIndex
                                          ? {
                                              ...s,
                                              closures: (s.closures ?? []).filter(
                                                (c) =>
                                                  c.closureId !==
                                                  closure.closureId,
                                              ),
                                            }
                                          : s,
                                      ),
                                    )
                                  }
                                  className="ml-0.5 text-emerald-400 hover:text-red-600"
                                  title="Remove closure"
                                >
                                  ×
                                </button>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}

                    <button
                      type="button"
                      onClick={() =>
                        setServices([
                          ...services,
                          {
                            productId: undefined,
                            productName: "",
                            categories: [],
                            closures: [],
                          },
                        ])
                      }
                      className="inline-flex h-8 items-center gap-1.5 rounded-md border border-blue-600 px-3 text-xs font-medium text-blue-600 transition hover:bg-blue-50"
                    >
                      <Plus size={14} />
                      Add Product
                    </button>
                  </div>
                </Section>

                {/* ================= CAPACITY MASTER ================= */}

                <Section title="Capacity Master">
                  <div className="space-y-8">
                    {/* COMBINED */}

                    <div className="rounded-lg border border-gray-200 bg-gray-50 p-2.5">
                      <h4 className="mb-5 text-sm font-semibold text-gray-900">
                        Combined Capacity
                      </h4>

                      <div className="grid gap-4 md:grid-cols-2">
                        <SearchSelect
                          label="Select Products"
                          value=""
                          placeholder="Search product..."
                          loading={productsLoading}
                          options={productOptions(combinedIds)}
                          onSearch={loadProducts}
                          onSelect={(option) => {
                            const product =
                              option.data as ProductDropdownOption;

                            if (combinedIds.includes(product.product_id)) {
                              toast.error(
                                "Product already selected in combined capacity.",
                              );
                              return;
                            }

                            updateCity(index, {
                              combinedCapacity: {
                                ...city.combinedCapacity,
                                products: [
                                  ...city.combinedCapacity.products,
                                  {
                                    productId: product.product_id,
                                    productName: product.product_name,
                                  },
                                ],
                              },
                            });
                          }}
                        />

                        <div>
                          <label className="mb-0.5 block text-[11px] font-medium text-gray-600">
                            Combined Capacity
                          </label>

                          <input
                            type="number"
                            min={0}
                            disabled={combinedIds.length === 0}
                            value={city.combinedCapacity.capacity || ""}
                            placeholder="Enter combined capacity"
                            onChange={(e) =>
                              updateCity(index, {
                                combinedCapacity: {
                                  ...city.combinedCapacity,
                                  capacity: Number(e.target.value || 0),
                                },
                              })
                            }
                            className={inputClass}
                          />
                        </div>
                      </div>

                      <div className="mt-5">
                        <p className="mb-2 text-sm font-medium text-gray-700">
                          Selected Products
                        </p>

                        {city.combinedCapacity.products.length > 0 ? (
                          <div className="flex flex-wrap gap-2">
                            {city.combinedCapacity.products.map((product) => (
                              <div
                                key={product.productId}
                                className="flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-3 py-1.5 text-xs font-medium text-blue-700"
                              >
                                <span>{product.productName}</span>

                                <button
                                  type="button"
                                  onClick={() => {
                                    const next =
                                      city.combinedCapacity.products.filter(
                                        (p) =>
                                          p.productId !== product.productId,
                                      );

                                    updateCity(index, {
                                      combinedCapacity: {
                                        products: next,
                                        capacity: next.length
                                          ? city.combinedCapacity.capacity
                                          : 0,
                                      },
                                    });
                                  }}
                                  className="flex h-5 w-5 items-center justify-center rounded-full text-blue-500 transition hover:bg-red-50 hover:text-red-600"
                                  title="Remove product"
                                >
                                  <X size={14} />
                                </button>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <p className="text-xs text-gray-400">
                            No products selected
                          </p>
                        )}
                      </div>
                    </div>

                    {/* INDIVIDUAL */}

                    <div className="rounded-lg border border-gray-200 bg-gray-50 p-2.5">
                      <h4 className="mb-5 text-sm font-semibold text-gray-900">
                        Individual Capacity
                      </h4>

                      <div className="mb-2 hidden grid-cols-[2fr_1fr_auto] gap-4 px-1 text-xs font-semibold uppercase tracking-wide text-gray-500 md:grid">
                        <div>Product</div>
                        <div>Capacity</div>
                        <div>Action</div>
                      </div>

                      <div className="space-y-2">
                        {city.individualCapacities.map((item, iIndex) => (
                          <div
                            key={iIndex}
                            className="grid gap-4 rounded-lg border border-gray-200 bg-white p-4 md:grid-cols-[2fr_1fr_auto]"
                          >
                            <SearchSelect
                              label="Product"
                              value={item.productName}
                              placeholder="Search product..."
                              loading={productsLoading}
                              options={productOptions(combinedIds)}
                              onSearch={loadProducts}
                              onSelect={(option) => {
                                const product =
                                  option.data as ProductDropdownOption;

                                if (
                                  city.individualCapacities.some(
                                    (c, i) =>
                                      i !== iIndex &&
                                      c.productId === product.product_id,
                                  )
                                ) {
                                  toast.error("Product already selected.");
                                  return;
                                }

                                setIndividual(
                                  city.individualCapacities.map((c, i) =>
                                    i === iIndex
                                      ? {
                                          ...c,
                                          productId: product.product_id,
                                          productName: product.product_name,
                                        }
                                      : c,
                                  ),
                                );
                              }}
                              onClear={() =>
                                setIndividual(
                                  city.individualCapacities.map((c, i) =>
                                    i === iIndex
                                      ? {
                                          ...c,
                                          productId: undefined,
                                          productName: "",
                                        }
                                      : c,
                                  ),
                                )
                              }
                            />

                            <div>
                              <label className="mb-0.5 block text-[11px] font-medium text-gray-600">
                                Capacity
                              </label>

                              <input
                                type="number"
                                min={0}
                                placeholder="Enter capacity"
                                value={item.capacity || ""}
                                onChange={(e) =>
                                  setIndividual(
                                    city.individualCapacities.map((c, i) =>
                                      i === iIndex
                                        ? {
                                            ...c,
                                            capacity: Number(
                                              e.target.value || 0,
                                            ),
                                          }
                                        : c,
                                    ),
                                  )
                                }
                                className={inputClass}
                              />
                            </div>

                            <div className="flex items-end">
                              <button
                                type="button"
                                onClick={() =>
                                  setIndividual(
                                    city.individualCapacities.filter(
                                      (_, i) => i !== iIndex,
                                    ),
                                  )
                                }
                                className="flex h-8 w-8 items-center justify-center rounded-lg border border-red-200 bg-white text-red-600 hover:bg-red-50"
                                title="Remove product"
                              >
                                <Trash2 size={16} />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>

                      <div className="mt-4">
                        <button
                          type="button"
                          onClick={() =>
                            setIndividual([
                              ...city.individualCapacities,
                              {
                                productId: undefined,
                                productName: "",
                                capacity: 0,
                              },
                            ])
                          }
                          className="inline-flex items-center gap-2 rounded-lg border border-[#123B7A] bg-white px-4 py-2.5 text-sm font-medium text-[#123B7A] transition hover:bg-blue-50"
                        >
                          <Plus size={17} />
                          Add Product
                        </button>
                      </div>
                    </div>
                  </div>
                </Section>
              </div>
            </div>
          );
        })}
      </div>

      <button
        type="button"
        onClick={() => onChange([...value, emptyCity()])}
        className="mt-4 inline-flex items-center gap-2 rounded-lg border border-[#123B7A] bg-white px-4 py-2.5 text-sm font-medium text-[#123B7A] transition hover:bg-blue-50"
      >
        <Plus size={17} />
        Add City
      </button>

      {closureModal &&
        (() => {
          const product =
            value[closureModal.cityIndex]?.productServices[
              closureModal.productIndex
            ];

          if (!product) return null;

          return (
            <ClosureMasterModal
              productId={product.productId}
              productName={product.productName}
              selected={product.closures ?? []}
              onClose={() => setClosureModal(null)}
              onSave={(closures) => {
                const city = value[closureModal.cityIndex];

                updateCity(closureModal.cityIndex, {
                  productServices: city.productServices.map((p, i) =>
                    i === closureModal.productIndex ? { ...p, closures } : p,
                  ),
                });

                setClosureModal(null);
              }}
            />
          );
        })()}

      {servicesModal &&
        (() => {
          const product =
            value[servicesModal.cityIndex]?.productServices[
              servicesModal.productIndex
            ];

          if (!product) return null;

          return (
            <ProductServicesModal
              productIndex={servicesModal.productIndex}
              productId={product.productId}
              productName={product.productName}
              selectedCategories={product.categories}
              onClose={() => setServicesModal(null)}
              onSave={(categories: DealerProductCategory[]) => {
                const city = value[servicesModal.cityIndex];

                updateCity(servicesModal.cityIndex, {
                  productServices: city.productServices.map((p, i) =>
                    i === servicesModal.productIndex ? { ...p, categories } : p,
                  ),
                });

                setServicesModal(null);
              }}
            />
          );
        })()}
    </div>
  );
}
