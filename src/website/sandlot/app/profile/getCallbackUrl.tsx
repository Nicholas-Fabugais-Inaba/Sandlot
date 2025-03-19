"use client";

import { useSearchParams } from "next/navigation"; // To handle the query parameters

export default function getCallbackUrl() {
    const searchParams = useSearchParams(); // Access the query params
    return searchParams?.get("callbackUrl") || "/profile"; // Default to '/profile' if no callbackUrl
}