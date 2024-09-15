import React, { useState, useEffect, useCallback } from "react";
import { IoChatbubblesOutline } from "react-icons/io5";
import { Button } from "../../../components/ui/button.tsx";
import { DialogTitle, DialogTrigger } from "@radix-ui/react-dialog";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader } from "../../../components/ui/dialog.tsx";
import { Label } from "../../../components/ui/label.tsx";
import { Input } from "../../../components/ui/input.tsx";
import { Search, Check } from "lucide-react";
import { Checkbox } from "../../../components/ui/checkbox.tsx";
import { debounce } from 'lodash';
import apiClient from "../../../lib/api-client.ts";
import {SEARCH_CONTACTS_ROUTE} from "../../../utils/Constants.ts";
import {Contact} from "../../../models/model-types.ts";

function SearchContacts({ onContactsSelected, selectedContacts, setSelectedContacts }) {
    const [isOpen, setIsOpen] = useState(false);
    const [query, setQuery] = useState("");
    const [contacts, setContacts] = useState<Contact[]>([]);
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(0);
    const [hasMore, setHasMore] = useState(false);

    const handleSave = () => {
        onContactsSelected(selectedContacts);
        setIsOpen(false);
        setSelectedContacts([]);
    };

    const fetchContacts = useCallback(async (searchQuery: string, pageNumber: number) => {
        try {
            setLoading(true);
            const response = await apiClient.get(SEARCH_CONTACTS_ROUTE, {
                params: { query: searchQuery, page: pageNumber, size: 20 }
            });
            const contactsResp = response.data.content;
            console.log(contactsResp);
            const newContacts: Contact[] = contactsResp.map(cont => {
                return {
                    "id": cont.userId,
                    "name": cont.firstName + " " + cont.lastName,
                    "email": cont.userEmail
                };
            });
            setContacts(prevContacts =>
                pageNumber === 0 ? newContacts : [...prevContacts, ...newContacts]
            );
            setHasMore(newContacts.length > 0);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching contacts:', error);
            setLoading(false);
        }
    }, []);

    const debouncedFetch = useCallback(
        debounce((currentQuery: string) => {
            setPage(0);
            fetchContacts(currentQuery, 0);
        }, 300),
        [fetchContacts]
    );

    useEffect(() => {
        if (isOpen && query.length > 0) {
            debouncedFetch(query);
        }
    }, [query, debouncedFetch, isOpen]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setQuery(e.target.value);
    };

    const loadMore = () => {
        if (!loading && hasMore) {
            const nextPage = page + 1;
            setPage(nextPage);
            fetchContacts(query, nextPage);
        }
    };

    const handleContactToggle = (contact: Contact) => {
        setSelectedContacts(prev =>
            prev.includes(contact)
                ? prev.filter(prevCon => prevCon.id !== contact.id)
                : [...prev, contact]
        );
    };

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button variant="outline" className="bg-background-light border-0">
                    <IoChatbubblesOutline size={30} />
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Search Contacts</DialogTitle>
                </DialogHeader>
                <div className="mt-2 relative">
                    <Input
                        type="text"
                        placeholder="Search..."
                        className="w-full pl-8 pr-4 py-2 rounded-full"
                        id="userNames"
                        value={query}
                        onChange={handleInputChange}
                    />
                    <Search className="absolute left-2 top-2.5 text-gray-400 w-4 h-4" />
                </div>
                <div className="mt-4 max-h-60 overflow-y-auto">
                    {loading ? (
                        <p>Loading contacts...</p>
                    ) : (
                        contacts.map((contact) => (
                            <div key={contact.id} className="flex items-center space-x-2 py-2">
                                <Checkbox
                                    id={contact.id}
                                    checked={selectedContacts.includes(contact)}
                                    onCheckedChange={() => handleContactToggle(contact)}
                                />
                                <Label htmlFor={contact.id} className="flex-grow">
                                    {contact.email}
                                </Label>
                                {selectedContacts.includes(contact) && (
                                    <Check className="w-4 h-4 text-green-500" />
                                )}
                            </div>
                        ))
                    )}
                    {/* Pagination load more button */}
                    {hasMore && !loading && (
                        <Button variant="link" onClick={loadMore} className="mt-4">
                            Load more
                        </Button>
                    )}
                </div>
                <DialogFooter>
                    <Button type="submit" onClick={handleSave}>Start Messaging</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

export default SearchContacts;
