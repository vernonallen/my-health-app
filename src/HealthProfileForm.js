import { useState } from "react";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import db from "./firebase";

export default function HealthProfileForm() {
  const [form, setForm] = useState({
    name: "",
    age: "",
    gender: "male",
    height: "",
    weight: "",
    neck: "",
    waist: "",
    hip: "",
    bodyFat: "",
    goal: "fat_loss",
    activity: "moderate",
    notes: "",
  });

  const [result, setResult] = useState(null);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const calculate = async () => {
    const height = parseFloat(form.height);
    const weight = parseFloat(form.weight);
    const neck = parseFloat(form.neck);
    const waist = parseFloat(form.waist);
    const hip = parseFloat(form.hip);

    let bodyFat = parseFloat(form.bodyFat);
    if (!bodyFat && height && neck && waist && (form.gender === "male" || hip)) {
      if (form.gender === "male") {
        bodyFat =
          86.010 * Math.log10(waist - neck) -
          70.041 * Math.log10(height) +
          36.76;
      } else {
        bodyFat =
          163.205 * Math.log10(waist + hip - neck) -
          97.684 * Math.log10(height) -
          78.387;
      }
    }

    let bmr;
    if (form.gender === "male") {
      bmr = 10 * weight + 6.25 * height - 5 * parseInt(form.age) + 5;
    } else {
      bmr = 10 * weight + 6.25 * height - 5 * parseInt(form.age) - 161;
    }

    const activityFactors = {
      sedentary: 1.2,
      light: 1.375,
      moderate: 1.55,
      active: 1.725,
      very_active: 1.9,
    };
    const tdee = bmr * activityFactors[form.activity];

    const calcResult = {
      bodyFat: bodyFat.toFixed(1),
      bmr: bmr.toFixed(0),
      tdee: tdee.toFixed(0),
    };
    setResult(calcResult);

    try {
      await addDoc(collection(db, "healthProfiles"), {
        ...form,
        bodyFat: parseFloat(calcResult.bodyFat),
        bmr: parseInt(calcResult.bmr),
        tdee: parseInt(calcResult.tdee),
        createdAt: serverTimestamp(),
      });
      alert("Profile saved to Firestore!");
    } catch (err) {
      console.error("Error saving profile: ", err);
      alert("Error saving profile.");
    }
  };

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Health Profile Setup</h1>
      <div className="space-y-4">
        <p><label><span className="block font-medium">Name</span><input className="border p-2 rounded w-full" name="name" onChange={handleChange} /></label></p>
        <p><label><span className="block font-medium">Age</span><input className="border p-2 rounded w-full" name="age" type="number" onChange={handleChange} /></label></p>
        <p><label><span className="block font-medium">Gender</span><select className="border p-2 rounded w-full" name="gender" onChange={handleChange}><option value="male">Male</option><option value="female">Female</option></select></label></p>
        <p><label><span className="block font-medium">Height (cm)</span><input className="border p-2 rounded w-full" name="height" onChange={handleChange} /></label></p>
        <p><label><span className="block font-medium">Weight (kg)</span><input className="border p-2 rounded w-full" name="weight" onChange={handleChange} /></label></p>
        <p><label><span className="block font-medium">Neck (cm)</span><input className="border p-2 rounded w-full" name="neck" onChange={handleChange} /></label></p>
        <p><label><span className="block font-medium">Waist (cm)</span><input className="border p-2 rounded w-full" name="waist" onChange={handleChange} /></label></p>
        {form.gender === "female" && (
          <p><label><span className="block font-medium">Hip (cm)</span><input className="border p-2 rounded w-full" name="hip" onChange={handleChange} /></label></p>
        )}
        <p><label><span className="block font-medium">Body Fat % (optional)</span><input className="border p-2 rounded w-full" name="bodyFat" onChange={handleChange} /></label></p>
        <p><label><span className="block font-medium">Goal</span><select className="border p-2 rounded w-full" name="goal" onChange={handleChange}><option value="fat_loss">Fat Loss</option><option value="muscle_gain">Muscle Gain</option><option value="endurance">Endurance</option><option value="general">General Fitness</option></select></label></p>
        <p><label><span className="block font-medium">Activity Level</span><select className="border p-2 rounded w-full" name="activity" onChange={handleChange}><option value="sedentary">Sedentary</option><option value="light">Light</option><option value="moderate">Moderate</option><option value="active">Active</option><option value="very_active">Very Active</option></select></label></p>
        <p><label><span className="block font-medium">Additional Notes</span><textarea className="border p-2 rounded w-full" name="notes" onChange={handleChange} /></label></p>
        <p><button className="bg-blue-600 text-white p-2 rounded" onClick={calculate}>Calculate + Save</button></p>
      </div>
      {result && (
        <div className="mt-6 p-4 bg-gray-100 rounded">
          <h2 className="text-xl font-semibold">Results</h2>
          <p><strong>Estimated Body Fat:</strong> {result.bodyFat}%</p>
          <p><strong>BMR:</strong> {result.bmr} kcal/day</p>
          <p><strong>Estimated Calorie Needs (TDEE):</strong> {result.tdee} kcal/day</p>
        </div>
      )}
    </div>
  );
}


