"use client";

import { useState, useEffect } from 'react';

type TDataJSON = {
  Entity: string;
  Currency: string;
  AlphabeticCode: string;
  NumericCode: number;
  MinorUnit: number;
  WithdrawalDate: string | null;
}

type TPreparedData = {
  Entity: string;
  Currency: string[];
}

export default function Table() {

  const [data, setData] = useState<TPreparedData[]>([]); 
  const [currentPage, setCurrentPage] = useState(1); 
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const itemsPerPage = 15; 
    
  useEffect(() => {
    const loadData = async () => {
      const response = await fetch('/data/data.json'); 
      const jsonData: TDataJSON[] = await response.json();
      if (jsonData?.length) {
        const preparedData = jsonData.reduce((acc: TPreparedData[], item: TDataJSON) => {
          const found = acc.find(entry => entry.Entity === item.Entity);
          if (found) {
              if (!found.Currency.includes(item.Currency)) {
                found.Currency.push(item.Currency);
              }
          } else {
              acc.push({
                  Entity: item.Entity,
                  Currency: [item.Currency]
              });
          }
      
          return acc;
        }, []);
        setData(preparedData);
      }
    }
    loadData();
  }, []);
  
  useEffect(() => {
    const savedSelection = localStorage.getItem('selectedItems');
    if (savedSelection) {
      setSelectedItems(JSON.parse(savedSelection));
    }
  }, []);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = data.slice(indexOfFirstItem, indexOfLastItem);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  const handleRadioChange = (entity: string) => {
    let updatedSelection: string[];

    if (selectedItems.includes(entity)) {
      updatedSelection = selectedItems.filter((item) => item !== entity);
    } else {
      updatedSelection = [...selectedItems, entity];
    }

    setSelectedItems(updatedSelection);
    localStorage.setItem('selectedItems', JSON.stringify(updatedSelection));

    console.log('Selected items saved to localStorage:', updatedSelection);
  };

  const totalPages = Math.ceil(data.length / itemsPerPage);

  return (
    <div className="container">
      <table className="table is-fullwidth is-striped">
        <thead>
          <tr>
            <th>Entity</th>
            <th>Currency</th>
            <th>Select</th>
          </tr>
        </thead>
        <tbody>
          {currentItems.map((item, index) => (
            <tr key={index}>
              <td>{item.Entity}</td>
              <td>{item.Currency.join(', ')}</td>
              <td>
                <label className="radio">
                  <input
                    type="checkbox"
                    checked={selectedItems.includes(item.Entity)}
                    onChange={() => handleRadioChange(item.Entity)}
                  />
                </label>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <nav className="pagination is-centered" role="navigation" aria-label="pagination">
        <button
          className="pagination-previous"
          onClick={() => paginate(currentPage - 1)}
          disabled={currentPage === 1}
        >
          Previous
        </button>
        <button
          className="pagination-next"
          onClick={() => paginate(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          Next
        </button>
        <ul className="pagination-list">
          {Array.from({ length: totalPages }, (_, i) => (
            <li key={i + 1}>
              <button
                className={`pagination-link ${
                  currentPage === i + 1 ? 'is-current' : ''
                }`}
                onClick={() => paginate(i + 1)}
                aria-label={`Go to page ${i + 1}`}
                >
                {i + 1}
              </button>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}
