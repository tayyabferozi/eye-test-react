import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  query,
  doc,
  collection,
  getDoc,
  getDocs,
  where,
} from "firebase/firestore";
import clsx from "clsx";
import { toast } from "react-toastify";
import Button from "../../components/Button";

import Section from "../../components/Section";
import { db } from "../../firebase";
import Graph from "./Graph";
import Dropdown from "../../components/Dropdown";
import "./TrainingStats.scss";

const yearOptions = [
  {
    label: 2023,
    value: 2023,
  },
  {
    label: 2024,
    value: 2024,
  },
  {
    label: 2025,
    value: 2025,
  },
  {
    label: 2026,
    value: 2026,
  },
  {
    label: 2027,
    value: 2027,
  },
  {
    label: 2028,
    value: 2028,
  },
  {
    label: 2029,
    value: 2029,
  },
  {
    label: 2030,
    value: 2030,
  },
];

const monthOptions = [
  {
    label: "January",
    value: 0,
  },
  {
    label: "February",
    value: 1,
  },
  {
    label: "March",
    value: 2,
  },
  {
    label: "April",
    value: 3,
  },
  {
    label: "May",
    value: 4,
  },
  {
    label: "June",
    value: 5,
  },
  {
    label: "July",
    value: 6,
  },
  {
    label: "Aughust",
    value: 7,
  },
  {
    label: "September",
    value: 8,
  },
  {
    label: "October",
    value: 9,
  },
  {
    label: "November",
    value: 10,
  },
  {
    label: "December",
    value: 11,
  },
];

const daysOptions = [
  {
    label: "1-10",
    value: "1-10",
  },
  {
    label: "11-20",
    value: "11-20",
  },
  {
    label: "21-30",
    value: "21-30",
  },
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
  {
    label: "Wrong (Low)",
    data: [],
    backgroundColor: "rgba(255, 99, 132, 0.33)",
    stack: "Stack 0",
  },
  {
    label: "Wrong (Optimal)",
    data: [],
    backgroundColor: "rgba(255, 99, 132, 0.66)",
    stack: "Stack 1",
  },
  {
    label: "Wrong (Easy)",
    data: [],
    backgroundColor: "rgba(255, 99, 132, 1)",
    stack: "Stack 2",
  },
];

const TrainingStats = ({ single }) => {
  const { id } = useParams();
  const [itemsData, setItemsData] = useState([]);
  const [labels, setLabels] = useState([]);
  const [datasets, setDatasets] = useState([]);
  const [yearState, setYearState] = useState(2023);
  const [monthState, setMonthState] = useState("January");
  const [daysState, setDaysState] = useState("1-10");
  const [isLoading, setIsLoading] = useState(true);

  const yearChangeHandler = (value) => {
    setYearState(value);
  };

  const monthChangeHandler = (value) => {
    setMonthState(value);
  };

  const daysChangeHandler = (value) => {
    setDaysState(value);
  };

  function setData(querySnapshot, snapshot) {
    const sanitizedData = [];
    const labelsData = [];
    const datasetsData = [...datasetStructure];

    querySnapshot.forEach((doc) => {
      const realData = snapshot ? doc.data() : doc;
      sanitizedData.push({ id: doc.id, ...realData });
      labelsData.push(new Date(realData.date.seconds * 1000).toLocaleString());
      datasetsData[0].data.push(realData.lightDotsClicked);
      datasetsData[1].data.push(realData.optimalDotsClicked);
      datasetsData[2].data.push(realData.brightDotsClicked);

      datasetsData[3].data.push(
        realData.splitted[0] - realData.lightDotsClicked
      );
      datasetsData[4].data.push(
        realData.splitted[1] - realData.optimalDotsClicked
      );
      datasetsData[5].data.push(
        realData.splitted[1] - realData.brightDotsClicked
      );
    });
    setItemsData(sanitizedData);
    setLabels(labelsData);
    setDatasets(datasetsData);
  }

  const getItemData = async function (id) {
    const docRef = doc(db, "trainings", id);
    setIsLoading(true);
    const data = await getDoc(docRef);
    if (data.exists()) {
      setData([data.data()]);
      setIsLoading(false);
    } else {
      toast.error("Document not found!", { toastId: "errorToast" });
    }
  };

  const getItemsData = async function (start, end) {
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
  };

  const filterHandler = () => {
    const year = yearState;
    const month = monthState;
    const days = daysState;

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
  }, [id]);

  return (
    <Section id="training-stats">
      {!single && (
        <div className="mb-30">
          <div className="dropdowns">
            <Dropdown
              withCheckmarks
              labelText="Select Year"
              defaultValue={new Date().getFullYear()}
              options={yearOptions}
              onChoose={yearChangeHandler}
            />
            <Dropdown
              withCheckmarks
              labelText="Select Month"
              defaultValue="January"
              options={monthOptions}
              onChoose={monthChangeHandler}
            />
            <Dropdown
              withCheckmarks
              labelText="Select Week"
              defaultValue="1-10"
              options={daysOptions}
              onChoose={daysChangeHandler}
            />
          </div>

          <div className="d-flex justify-content-center p-3">
            <Button primary onClick={filterHandler}>
              Apply
            </Button>
          </div>
        </div>
      )}
      {!isLoading ? (
        <div className={clsx("graph", { single })}>
          <Graph labels={labels} datasets={datasets} />
        </div>
      ) : (
        <>Loading...</>
      )}
    </Section>
  );
};

export default TrainingStats;
