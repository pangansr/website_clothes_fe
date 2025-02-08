import Link from "next/link";
import { ProductType } from "./product/ProductCard";
import { useRouter } from "next/navigation";
import { RefObject } from "react";
import { Avatar, HStack } from "@chakra-ui/react";

const SearchResults = ({
    searchResults,
    isSearching,
    handleClick,
}: {
    searchResults: ProductType[];
    isSearching: boolean;
    handleClick: (productId: string) => void;
}) => {
    return (
        <div className="absolute  w-[20rem] flex flex-col items-center p-2 bg-white shadow-custom">
            {isSearching ? (
                <p>Searching...</p>
            ) : searchResults.length == 0 ? (
                <p>No Results</p>
            ) : (
                searchResults.map((result) => (
                    <HStack
                        key={result._id}
                        className="w-full hover:bg-gray-100 p-2 cursor-pointer"
                    >
                        <Avatar size="sm" src={result.productImg.url} />
                        <p
                            key={result._id}
                            onClick={() => handleClick(result._id)}
                        >
                            {result.productName}
                        </p>
                    </HStack>
                ))
            )}
        </div>
    );
};

export default SearchResults;
