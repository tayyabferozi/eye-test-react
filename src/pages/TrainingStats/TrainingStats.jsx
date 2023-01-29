import React, { useEffect, useState, useCallback } from "react";
import { useParams } from "react-router-dom";
import {
  query,
  doc,
  collection,
  getDoc,
  getDocs,
  where,
  orderBy,
} from "firebase/firestore";
import clsx from "clsx";
import { toast } from "react-toastify";

import Button from "../../components/Button";
import Section from "../../components/Section";
import { db } from "../../firebase";
import Graph from "./Graph";
import Dropdown from "../../components/Dropdown";
import isEmpty from "../../utils/is-empty";
import "./TrainingStats.scss";

const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "November",
  "December",
];

const datasetStructure = [
  {
    label: "Correct (Low)",
    data: [],
    backgroundColor: "rgba(75, 192, 192, 0.33)",
    stack: "Stack 0",
  },
  {
    label: "Correct (Optimal)",
    data: [],
    backgroundColor: "rgba(75, 192, 192, .66)",
    stack: "Stack 1",
  },
  {
    label: "Correct (Easy)",
    data: [],
    backgroundColor: "rgba(75, 192, 192, 1)",
    stack: "Stack 2",
  },
  // {
  //   label: "Wrong (Low)",
  //   data: [],
  //   backgroundColor: "rgba(255, 99, 132, 0.33)",
  //   stack: "Stack 0",
  // },
  // {
  //   label: "Wrong (Optimal)",
  //   data: [],
  //   backgroundColor: "rgba(255, 99, 132, 0.66)",
  //   stack: "Stack 1",
  // },
  // {
  //   label: "Wrong (Easy)",
  //   data: [],
  //   backgroundColor: "rgba(255, 99, 132, 1)",
  //   stack: "Stack 2",
  // },
];

const TrainingStats = ({ single }) => {
  const { id } = useParams();
  const [labels, setLabels] = useState([]);
  const [selectedDate, setSelectedDate] = useState("");
  const [datasets, setDatasets] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSelectionLoading, setIsSelectionLoading] = useState(false);
  const [dateSelectionState, setDateSelectionState] = useState([]);

  const dateChangeHandler = (value) => {
    setSelectedDate(value);
  };

  const getSelectValues = useCallback(async () => {
    setIsSelectionLoading(true);
    const querySnapshot = (
      await getDocs(query(collection(db, "trainings"), orderBy("date")))
    ).docs;
    const sanitizedData = [];
    const s = new Set();
    querySnapshot.forEach((doc) => {
      const docExtracted = { id: doc.id, ...doc.data() };
      const dateExtracted = docExtracted.date
        ? new Date(docExtracted.date.seconds * 1000)
        : "";
      const year = dateExtracted.getFullYear();
      const month = months[dateExtracted.getMonth()];
      const day = dateExtracted.getDate();
      let rangeDays;
      if (day >= 1 && day <= 10) {
        rangeDays = "1-10";
      } else if (day >= 11 && day <= 20) {
        rangeDays = "11-20";
      } else {
        if (month === 1) {
          if (year % 4 === 0) {
            rangeDays = "21-30";
          } else {
            rangeDays = "21-29";
          }
        } else if (
          month === 0 ||
          month === 2 ||
          month === 4 ||
          month === 6 ||
          month === 7 ||
          month === 9 ||
          month === 11
        ) {
          rangeDays = "21-31";
        } else {
          rangeDays = "21-30";
        }
      }

      const dateStr = `${rangeDays} ${month} ${year}`;
      s.add(dateStr);
      sanitizedData.push(docExtracted);
      setIsSelectionLoading(false);
    });
    const arr = Array.from(s);
    const arr2 = arr.map((el) => ({ label: el, value: el }));
    setDateSelectionState(arr2);
  }, []);

  const setData = useCallback(function (querySnapshot, snapshot) {
    const labelsData = [];
    const datasetsData = JSON.parse(JSON.stringify(datasetStructure));

    const aggregatedData = {};

    querySnapshot.forEach((doc) => {
      const realData = snapshot ? doc.data() : doc;
      const parsedDate = new Date(
        realData.date.seconds * 1000
      ).toLocaleDateString();

      if (isEmpty(aggregatedData[parsedDate])) {
        aggregatedData[parsedDate] = {};
        aggregatedData[parsedDate].lightDotsClicked = 0;
        aggregatedData[parsedDate].optimalDotsClicked = 0;
        aggregatedData[parsedDate].brightDotsClicked = 0;

        aggregatedData[parsedDate].lightDotsTotal = 0;
        aggregatedData[parsedDate].optimalDotsTotal = 0;
        aggregatedData[parsedDate].brightDotsTotal = 0;

        aggregatedData[parsedDate].lightDotsMissed = 0;
        aggregatedData[parsedDate].optimalDotsMissed = 0;
        aggregatedData[parsedDate].brightDotsMissed = 0;
      }

      aggregatedData[parsedDate].lightDotsClicked += realData.lightDotsClicked;
      aggregatedData[parsedDate].optimalDotsClicked +=
        realData.optimalDotsClicked;
      aggregatedData[parsedDate].brightDotsClicked +=
        realData.brightDotsClicked;

      aggregatedData[parsedDate].lightDotsTotal += realData.splitted[0];
      aggregatedData[parsedDate].optimalDotsTotal += realData.splitted[1];
      aggregatedData[parsedDate].brightDotsTotal += realData.splitted[2];

      aggregatedData[parsedDate].lightDotsMissed +=
        realData.splitted[0] - realData.lightDotsClicked;
      aggregatedData[parsedDate].optimalDotsMissed +=
        realData.splitted[1] - realData.optimalDotsClicked;
      aggregatedData[parsedDate].brightDotsMissed +=
        realData.splitted[2] - realData.brightDotsClicked;
    });

    for (const key in aggregatedData) {
      if (Object.hasOwnProperty.call(aggregatedData, key)) {
        const element = aggregatedData[key];
        labelsData.push(key);
        datasetsData[0].data.push(
          (element.lightDotsClicked / element.lightDotsTotal) * 100
        );
        datasetsData[1].data.push(
          (element.optimalDotsClicked / element.optimalDotsTotal) * 100
        );
        datasetsData[2].data.push(
          (element.brightDotsClicked / element.brightDotsTotal) * 100
        );

        // datasetsData[3].data.push(
        //   (element.lightDotsMissed / element.lightDotsTotal) * 100
        // );
        // datasetsData[4].data.push(
        //   (element.optimalDotsMissed / element.optimalDotsTotal) * 100
        // );
        // datasetsData[5].data.push(
        //   (element.brightDotsMissed / element.brightDotsTotal) * 100
        // );
      }
    }

    setLabels(labelsData);
    setDatasets(datasetsData);
  }, []);

  const getItemData = useCallback(
    async function (id) {
      const docRef = doc(db, "trainings", id);
      setIsLoading(true);
      const data = await getDoc(docRef);
      if (data.exists()) {
        setData([data.data()]);
        setIsLoading(false);
      } else {
        toast.error("Document not found!", { toastId: "errorToast" });
      }
    },
    [setData]
  );

  const getItemsData = useCallback(
    async function (start, end) {
      if (!start || !end) {
        setIsLoading(false);
        return;
      }

      const docRef = collection(db, "trainings");
      const q = query(
        docRef,
        where("date", ">=", start),
        where("date", "<=", end)
      );

      setIsLoading(true);
      const querySnapshot = await getDocs(q);
      setData(querySnapshot, true);
      setIsLoading(false);
    },
    [setData]
  );

  const filterHandler = () => {
    if (isEmpty(selectedDate) || selectedDate === "Select date") return;
    const arr = selectedDate.split(" ");
    const days = arr[0];
    const month = arr[1];
    const year = arr[2];

    const startDate = new Date(`${month} ${days.split("-")[0]}, ${year} `);
    const endDate = new Date(`${month} ${+days.split("-")[1] + 1}, ${year} `);

    getItemsData(startDate, endDate);
  };

  useEffect(() => {
    if (single && id) {
      getItemData(id);
    } else {
      getItemsData();
    }
  }, [id, getItemData, getItemsData, single]);

  useEffect(() => {
    getSelectValues();
  }, [getSelectValues]);

  return (
    <>
      <Section id="training-stats">
        <Button className="back" to="/">
          {" "}
          &lt; Back
        </Button>
        {!single &&
          (isSelectionLoading ? (
            <div className="text-center">Dates Loading...</div>
          ) : (
            <div className="mb-30">
              <div className="d-flex justify-content-center align-items-center p-3 gap-3">
                <div className="dropdowns">
                  <Dropdown
                    withCheckmarks
                    labelText="Select Month"
                    defaultValue="Select date"
                    options={dateSelectionState}
                    onChoose={dateChangeHandler}
                  />
                </div>

                <Button primary onClick={filterHandler}>
                  Apply
                </Button>
              </div>
            </div>
          ))}
        {!isLoading ? (
          <div className={clsx("graph mt-40", { single })}>
            {!isEmpty(labels) ? (
              <Graph
                labels={labels}
                datasets={datasets}
                ticksCb={
                  // single
                  //   ? (value) => (value > 100 ? "" : value) :
                  (value, index, idx) => {
                    return value > 100 ? "" : value + "%";
                  }
                }
              />
            ) : (
              <div className="text-center">NO RECORDS FOUND!</div>
            )}
          </div>
        ) : (
          <div className="text-center">Loading...</div>
        )}
      </Section>
    </>
  );
};

export default TrainingStats;
