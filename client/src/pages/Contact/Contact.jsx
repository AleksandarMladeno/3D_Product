import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Contact.css";
import { HashLoader } from "react-spinners";

function Contact() {
  const [contributors, setContributors] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [usersPerPage] = useState(18);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          "https://api.github.com/repos/amanjaiman1/Product_3D/contributors"
        );
        const contributorsData = response.data;
        const updatedContributors = await Promise.all(
          contributorsData.map(async (contributor) => {
            try {
              const contributorResponse = await axios.get(contributor.url);
              const { name, bio, location } = contributorResponse.data;
              return { ...contributor, name, bio, location };
            } catch (error) {
              console.log(`Error fetching contributor details: ${error}`);
              return contributor;
            }
          })
        );
        setContributors(updatedContributors);
        setLoading(false);
      } catch (error) {
        console.log(`Error fetching contributors: ${error}`);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Get current users
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = contributors.slice(indexOfFirstUser, indexOfLastUser);

  // Change page
  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  // Handle search input change
  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  // Filter users based on search query
  const filteredUsers = currentUsers.filter((user) => {
    const lowerCaseSearchQuery = searchQuery.toLowerCase();
    const lowerCaseLogin = user.login.toLowerCase();
    const lowerCaseName = user.name ? user.name.toLowerCase() : "";

    return (
      lowerCaseLogin.includes(lowerCaseSearchQuery) ||
      lowerCaseName.includes(lowerCaseSearchQuery)
    );
  });

  return (
    <div className="contact-container">
      <div className="my-5">
        <h2 className="text-3xl font-bold text-center justify-center">
          Meet Our Talented Team
        </h2>
        <p className="text-center text-secondary mt-5  text-lg lg:px-60">
          Our project's success is attributed to the dedicated contributors who
          brought expertise and creativity. Meet the amazing individuals behind our
          accomplishments.
        </p>
      </div>
      <div className="flex justify-center mt-4">
        <input
          className="w-80 h-12 px-4 py-2 rounded-full shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white border border-gray-300 text-gray-700 placeholder-gray-400 text-sm"
          type="text"
          placeholder="Search by username and Name"
          value={searchQuery}
          onChange={handleSearchChange}
        />
      </div>

      {loading ? (
        <div className="flex justify-center mt-10">
          <HashLoader color="red"
            ariaLabel="grid-loading"
            wrapperStyle={{}}
            wrapperClass=""
            visible={true} />
        </div>
      ) : (
        <div className="flex flex-wrap justify-center p-6 gap-4 rounded-xl sm:p-12 dark:text-gray-100 ml-2">
          {filteredUsers.map((contributor) => (
            <div key={contributor.id} className="card">
              <div className="content">
                <div className="back">
                  <div className="back-content">
                    <img src={contributor.avatar_url} alt={contributor.login} />

                    <strong
                      className="text-black mb-10 font-bold"
                      style={{ cursor: "pointer" }}
                      onClick={() =>
                        window.open(`https://github.com/${contributor.login}`)
                      }
                    >
                      {contributor.name === null
                        ? contributor.login
                        : contributor.name}
                    </strong>
                  </div>
                </div>
                <div className="front">
                  <div className="img">
                    <div className="circle"></div>
                    <div className="circle" id="right"></div>
                    <div className="circle" id="bottom"></div>
                  </div>
                  <div className="front-content">
                    <small className="badge">
                      Contributions: {contributor.contributions}
                    </small>
                    <img
                      src={contributor.avatar_url}
                      className="rounded-full w-20 h-20 mx-auto "
                      alt=""
                    />
                    <div className="description">
                      <div className="title">
                        <p className="title">
                          <strong>{contributor.login}</strong>
                        </p>
                      </div>
                      {/* if the name bio loaction is null show Not avilable else show the data */}

                      {contributor.name === null ? (
                        <p className="card-footer">Name: Not Available</p>
                      ) : (
                        <p className="card-footer">Name: {contributor.name}</p>
                      )}

                      {contributor.bio === null ? (
                        <p className="card-footer">Bio: Not Available</p>
                      ) : (
                        <p className="card-footer">Bio: {contributor.bio}</p>
                      )}

                      {contributor.location === null ? (
                        <p className="card-footer">Location: Not Available</p>
                      ) : (
                        <p className="card-footer">
                          Location: {contributor.location}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
          {contributors.length === 0 && <p>No contributors found.</p>}
        </div>
      )}

      <div className="pagination">
        {contributors.length > 0 && (
          <ul className="flex justify-center space-x-4 mt--10 mb-9">
            {Array.from(
              { length: Math.ceil(contributors.length / usersPerPage) },
              (_, index) => (
                <li
                  key={index}
                  className={`cursor-pointer ${
                    currentPage === index + 1 ? "font-bold" : ""
                  }`}
                  onClick={() => paginate(index + 1)}
                  >
                  {index + 1}
                </li>
              )
            )}
          </ul>
        )}
      </div>
    </div>
  );
}

export default Contact;
