import { Input, InputGroup, InputLeftElement } from "@chakra-ui/react";
import React, { ChangeEvent, FormEvent, useRef, useState } from "react";
import { BsSearch } from "react-icons/bs";
import SearchResults from "./SearchResults";
import { searchProducts } from "../api/productsApi";
import { ProductType } from "./product/ProductCard";
import { useRouter } from "next/navigation";
import throttle from "lodash.throttle";

const SearchBar = () => {
    const router = useRouter();
    const inputRef = useRef<HTMLInputElement>(null);
    const [searchResults, setSearchResults] = useState<ProductType[]>([]);
    const [isSearching, setIsSearching] = useState(false);

    const handleSearch = async (productName: string) => {
        setIsSearching(true);
        const response = await searchProducts(productName);
        console.log(response);
        setSearchResults(response);
        setIsSearching(false);
    };
    const handleChange = throttle((e: string) => handleSearch(e), 500);

    const handleClick = (productId: string) => {
        router.push(`/product/${productId}`);
        inputRef.current!.value = "";
        setSearchResults([]);
    };

    return (
        <div className="relative ">
            <form
                onSubmit={(e) => {
                    e.preventDefault();
                    handleSearch(inputRef.current!.value);
                }}
            >
                <InputGroup>
                    <InputLeftElement
                        className="cursor-pointer"
                        onClick={() => handleSearch(inputRef.current!.value)}
                    >
                        <BsSearch />
                    </InputLeftElement>
                    <Input
                        ref={inputRef}
                        type="search"
                        placeholder="Search"
                        rounded="full"
                        onChange={(e) => handleChange(e.target.value)}
                    />
                </InputGroup>
            </form>

            {inputRef.current?.value && (
                <SearchResults
                    searchResults={searchResults}
                    isSearching={isSearching}
                    handleClick={handleClick}
                />
            )}
        </div>
    );
};

export default SearchBar;
