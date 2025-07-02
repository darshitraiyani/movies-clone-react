export default function Search({searchTerm,setSearchTerm,onSearchTermChange}) {

    function handleInputChange(event) {
        setSearchTerm(event.target.value);
        onSearchTermChange(1);//Change Page Value To 1
    }
    return (
        <div className="search">
            <div>
                <img src="search.svg" alt="search"/>

                <input
                    type="text"
                    placeholder="Search through thousands of movies"
                    value={searchTerm}
                    onChange={handleInputChange}
                />
            </div>
        </div>
    )
}