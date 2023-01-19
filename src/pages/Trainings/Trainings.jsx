import React, { useCallback, useEffect, useState, useRef } from "react";
import { EyeIcon, PencilIcon, TrashIcon } from "@primer/octicons-react";
import {
  collection,
  getDocs,
  deleteDoc,
  doc,
  getDoc,
} from "firebase/firestore";
import { useNavigate } from "react-router-dom";

import useRootContext from "../../hooks/useRootContext";
import { db } from "../../firebase";
import Section from "../../components/Section";
import Button from "../../components/Button";
import { toast } from "react-toastify";
import * as actionTypes from "../../context/actionTypes";
import "./Trainings.scss";

const Training = () => {
  const navigate = useNavigate();
  const { dispatch } = useRootContext();

  const dataFetchedRef = useRef(false);
  const [isLoading, setIsLoading] = useState(false);
  const [items, setItems] = useState([]);

  const startSaved = (data) => {
    delete data.id;
    dispatch({
      type: actionTypes.SET_FORM_VALUES,
      payload: data,
    });
    navigate("/training-start");
  };

  const editSaved = (data) => {
    delete data.id;
    dispatch({
      type: actionTypes.SET_FORM_VALUES,
      payload: data,
    });
    navigate("/new-training?form=edit");
  };

  const deleteItem = async (id) => {
    dataFetchedRef.current = false;
    setItems([]);
    setIsLoading(true);
    await deleteDoc(doc(db, "trainings", id));
    toast.success("Item deleted succesfully!");
    getData();
  };

  const getData = useCallback(async () => {
    if (dataFetchedRef.current) return;
    dataFetchedRef.current = true;

    setIsLoading(true);
    const querySnapshot = await getDocs(collection(db, "trainings"));
    const sanitizedData = [];
    querySnapshot.forEach((doc) => {
      sanitizedData.push({ id: doc.id, ...doc.data() });
    });
    setItems(sanitizedData);
    setIsLoading(false);
  }, []);

  useEffect(() => {
    getData();
  }, [getData]);

  return (
    <Section id="training">
      <div className="main-layout">
        <div>
          <h3 className="mb-30 text-center">Trainings</h3>

          {isLoading ? (
            <h6 className="text-center">Loading...</h6>
          ) : (
            <div className="table-container mt-30">
              <table>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Date</th>
                    <th>Target Eye</th>
                    <th>Performance</th>
                    <th>Expected Duration</th>
                    <th>Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {items.map((el, idx) => {
                    return (
                      <tr
                        key={"training-data-item" + idx}
                        className="text-center"
                      >
                        <td>{el.name}</td>
                        <td>
                          {new Date(
                            el.date.seconds * 1000
                          ).toLocaleDateString()}
                        </td>
                        <td>{el.eye}</td>
                        <td>{(el.clickedDots / el.totalDots) * 100}%</td>
                        <td>
                          {el.durationOn === "dots"
                            ? `${
                                +el.maxTrainingDots *
                                (el.responseTime + el.displayTime)
                              }s`
                            : `${el.maxTrainingDuration * 60}s`}
                        </td>
                        <td>
                          <div className="d-flex justify-content-center gap-10">
                            <Button onClick={() => startSaved(el)} primary>
                              Start
                            </Button>
                            <Button secondary to={`/training-stats/${el.id}`}>
                              <EyeIcon size={16} />
                            </Button>
                            <Button secondary onClick={() => editSaved(el)}>
                              <PencilIcon size={16} />
                            </Button>
                            <Button secondary onClick={() => deleteItem(el.id)}>
                              <TrashIcon size={16} />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div className="bottom-nav">
          <Button to="/training-stats" secondary>
            Graph
          </Button>
          <Button to="/new-training" primary>
            New Training
          </Button>
        </div>
      </div>
    </Section>
  );
};

export default Training;
