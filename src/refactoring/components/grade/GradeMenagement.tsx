import { useState } from "react";
import { SectionTitle, Button } from "../";
import { useCartContext } from "../../contexts";

const GradeMenagement = () => {
  const [newGradeName, setNewGradeName] = useState({
    name: "",
    discountRate: 0,
  });
  const { grade, addGrade } = useCartContext();

  return (
    <div>
      <SectionTitle>등급 관리</SectionTitle>
      <div className="bg-white p-4 shadow rounded">
        <div className="flex flex-row gap-2">
          {grade.map((grade) => (
            <div key={grade.name}>
              <p>{grade.name}</p>
              <p>{grade.discountRate}%</p>
            </div>
          ))}
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="gradeName">등급 이름</label>
          <input
            type="text"
            id="gradeName"
            placeholder="새로운 등급 이름"
            value={newGradeName.name}
            onChange={(e) =>
              setNewGradeName({ ...newGradeName, name: e.target.value })
            }
          />
        </div>
        <div className="flex flex-col gap-2">
          <label htmlFor="discountRate">할인율</label>
          <input
            type="number"
            id="discountRate"
            placeholder="새로운 등급 할인율"
            value={newGradeName.discountRate}
            onChange={(e) =>
              setNewGradeName({
                ...newGradeName,
                discountRate: parseInt(e.target.value),
              })
            }
          />
        </div>
        <Button onClick={() => addGrade(newGradeName)}>등급 추가</Button>
      </div>
    </div>
  );
};

export default GradeMenagement;
