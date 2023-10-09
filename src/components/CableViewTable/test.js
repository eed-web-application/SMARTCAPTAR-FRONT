import { useTable } from "react-table";
import React, { useState, useEffect } from "react";
// import "../Cables/styles.css";

import axios from "axios";
import baseUrl from "../../config";
axios.defaults.baseURL = baseUrl;

// import {socket} from '../socket'

function CableViewTableTest(props) {
  const [cables, setCables] = useState([]);
  const [page, setPage] = useState(1);

  useEffect(() => {
    getCablesAPI(page);
  }, []);

  const getCablesAPI = async (p) => {
    console.log("GETTING CABLES");

    const response = await fetch(
      `${baseUrl}/getCables?offset=${(p - 1) * 10}&table=${props.table}`
    );
    const data = await response.json();
    console.log(data.cables);
    setCables(data.cables);

    setLoading(false);
    console.log("GOT CABLES");
  };

  const data = cables;
  console.log(data);
  const columns = React.useMemo(
    () => [
      {
        Header: "CABLENUM",
        accessor: "CABLENUM", // accessor is the "key" in the data
      },
      {
        Header: "STATUS",
        accessor: "STATUS",
      },
    ],
    []
  );

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    useTable({ columns, data });

  return (
    <table {...getTableProps()} className="table">
      <thead>
        {headerGroups.map((headerGroup) => (
          <tr {...headerGroup.getHeaderGroupProps()} class="tableSeperator">
            {headerGroup.headers.map((column) => (
              <th {...column.getHeaderProps()}>{column.render("Header")}</th>
            ))}
          </tr>
        ))}
      </thead>
      <tbody {...getTableBodyProps()}>
        {rows.map((row) => {
          prepareRow(row);
          return (
            <tr {...row.getRowProps()}>
              {row.cells.map((cell) => {
                return <td {...cell.getCellProps()}>{cell.render("Cell")}</td>;
              })}
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}
export default CableViewTableTest;
