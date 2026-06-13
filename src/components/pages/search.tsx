import { useState } from "react";
import Container from "../Container";
import { NavbarSearch } from "../Navbar";

export default function SeachPage() {
    const [searchList, setSearchList] = useState([])
    const listeOfResearch = window.localStorage.getItem('listSearch') === null ? "[]" : window.localStorage.getItem('listSearch')

    const addToResearchList = (value: string) => {
        let lastContent = JSON.parse(listeOfResearch as string) as []

        if (lastContent.length >= 10) {
            lastContent = lastContent.reverse().slice(0, 9) as []
            window.localStorage.setItem('listSearch', JSON.stringify(lastContent))
        } else {
            window.localStorage.setItem('listSearch', JSON.stringify(lastContent))
        }
    }

    const handleSearch = (e) => {
        e.preventDefault();
        console.log(e.target.search)

    }
    return (
        <div>
            <NavbarSearch onSubmit={handleSearch} />
            <TitreAndRecentSearch searchList={searchList} />
            <div className="grid"></div>
        </div>
    )
}

function TitreAndRecentSearch({ searchList }: { searchList: string[] }) {

    return (
        <div className="mt-10">
            <Container>
                <h1 className="text-[64px] font-bold inter mb-10" style={{ lineHeight: 1 }}>Recherche</h1>
                <div>

                </div>
            </Container>
        </div>
    )
}