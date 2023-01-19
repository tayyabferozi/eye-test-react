import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { toast } from "react-toastify";

import Section from "../../components/Section";
import { db } from "../../firebase";
import Graph from "./Graph";
import "./TrainingStats.scss";

const TrainingStats = () => {
  const { id } = useParams();
  const [itemData, setItemData] = useState({});

  const getItemData = async function (id) {
    const docRef = doc(db, "trainings", id);
    const data = await getDoc(docRef);
    if (data.exists()) {
      setItemData(data.data());
    } else {
      toast.error("Document not found!", { toastId: "errorToast" });
    }
  };

  console.log(itemData);

  useEffect(() => {
    if (id) {
      getItemData(id);
    }
  }, [id]);

  return (
    <Section id="training-stats">
      {itemData?.date?.seconds && (
        <div className="graph">
          <Graph
            labels={[
              new Date(itemData.date.seconds * 1000).toLocaleDateString(),
            ]}
            datasets={[
              {
                label: "Correct (Low)",
                data: [itemData.lightDotsClicked],
                backgroundColor: "rgba(75, 192, 192, 0.33)",
                stack: "Stack 0",
              },
              {
                label: "Correct (Optimal)",
                data: [itemData.optimalDotsClicked],
                backgroundColor: "rgba(75, 192, 192, .66)",
                stack: "Stack 1",
              },
              {
                label: "Correct (Easy)",
                data: [itemData.brightDotsClicked],
                backgroundColor: "rgba(75, 192, 192, 1)",
                stack: "Stack 2",
              },
              {
                label: "Wrong (Low)",
                data: [itemData.splitted[0] - itemData.lightDotsClicked],
                backgroundColor: "rgba(255, 99, 132, 0.33)",
                stack: "Stack 0",
              },
              {
                label: "Wrong (Optimal)",
                data: [itemData.splitted[1] - itemData.optimalDotsClicked],
                backgroundColor: "rgba(255, 99, 132, 0.66)",
                stack: "Stack 1",
              },
              {
                label: "Wrong (Easy)",
                data: [itemData.splitted[1] - itemData.brightDotsClicked],
                backgroundColor: "rgba(255, 99, 132, 1)",
                stack: "Stack 2",
              },
            ]}
          />
        </div>
      )}
    </Section>
  );
};

export default TrainingStats;
