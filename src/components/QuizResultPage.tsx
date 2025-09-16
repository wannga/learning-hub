import React, { useEffect, useState } from "react";
import SideBar from "./bar/Sidebar.tsx";
import Header from "./bar/Header.tsx";
import { useNavigate } from "@remix-run/react";

type User = {
  id: number;
  username: string;
  quiz_score: number;
};

type InvestorType = {
  name: string;
  min_score: number;
  max_score: number;
  description: string;
};

const QuizResultPage: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [userResult, setUserResult] = useState<InvestorType | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const storedUserId = sessionStorage.getItem("userId");
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");

  const investorTypes: InvestorType[] = [
    {
      name: "Defensive",
      min_score: 1,
      max_score: 18,
      description: "คุณเป็นนักลงทุนเชิงป้องกัน (Defensive) ที่ให้ความสำคัญกับการรักษาเงินลงทุนปัจจุบันมากกว่าการแสวงหาผลตอบแทนที่สูงขึ้น"
    },
    {
      name: "Conservative",
      min_score: 19,
      max_score: 39,
      description: "คุณเป็นนักลงทุนเชิงอนุรักษ์ (Conservative) ที่มุ่งหวังรายได้เป็นหลัก และอาจมีการเติบโตของเงินทุนบ้าง คุณชอบการลงทุนที่มีความผันผวนต่ำ และยอมรับผลตอบแทนที่ต่ำกว่าได้"
    },
    {
      name: "Balanced",
      min_score: 40,
      max_score: 64,
      description: "คุณเป็นนักลงทุนสมดุล (Balanced) ที่เข้าใจพฤติกรรมของตลาดการลงทุนบ้าง และชอบความสมดุลระหว่างการเติบโตของเงินทุนและความปลอดภัยของเงินต้น คุณยอมรับความเสี่ยงระยะสั้นบางส่วนเพื่อแลกกับการเติบโตในระยะยาว"
    },
    {
      name: "Assertive",
      min_score: 65,
      max_score: 88,
      description: "คุณเป็นนักลงทุนเชิงรุก (Assertive) ที่ให้ความสำคัญกับการเติบโตของเงินทุนระยะยาว และยอมรับความผันผวนและความเสี่ยงที่สูงขึ้นในระยะสั้นเพื่อโอกาสในการสร้างผลตอบแทนที่ดีกว่า"
    },
    {
      name: "Aggressive",
      min_score: 89,
      max_score: 100,
      description: "คุณเป็นนักลงทุนเชิงรุกขั้นสูง (Aggressive) ที่มุ่งเน้นผลตอบแทนสูงสุดในระยะยาว คุณเต็มใจรับความเสี่ยงและความผันผวนของมูลค่าการลงทุนในระดับสูงมากเพื่อแลกกับโอกาสสร้างผลตอบแทนที่มากกว่า"
    }
  ];

  useEffect(() => {
    const fetchUser = async () => {
      try {
        if (!storedUserId) {
          setError("No userId found in sessionStorage");
          return;
        }

        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/getUserById/${storedUserId}`
        );
        if (!res.ok) {
          throw new Error("ไม่สามารถโหลดผู้ใช้ได้");
        }

        const data: User = await res.json();
        setUser(data);
        
        if (data.quiz_score !== undefined && data.quiz_score !== null) {
          const result = getUserResult(data.quiz_score);
          setUserResult(result);
        }
      } catch (err: any) {
        console.error(err);
        setError(err.message || "เกิดข้อผิดพลาด");
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  const getUserResult = (score: number): InvestorType | null => {
    return investorTypes.find(type => 
      score >= type.min_score && score <= type.max_score
    ) || null;
  };

  const getColorScheme = (investorType: string) => {
    switch (investorType) {
      case "Defensive":
        return {
          bg: "bg-blue-50",
          border: "border-blue-200",
          title: "text-blue-800",
          badge: "bg-blue-100 text-blue-800",
          description: "text-blue-700"
        };
      case "Conservative":
        return {
          bg: "bg-green-50",
          border: "border-green-200",
          title: "text-green-800",
          badge: "bg-green-100 text-green-800",
          description: "text-green-700"
        };
      case "Balanced":
        return {
          bg: "bg-yellow-50",
          border: "border-yellow-200",
          title: "text-yellow-800",
          badge: "bg-yellow-100 text-yellow-800",
          description: "text-yellow-700"
        };
      case "Assertive":
        return {
          bg: "bg-orange-50",
          border: "border-orange-200",
          title: "text-orange-800",
          badge: "bg-orange-100 text-orange-800",
          description: "text-orange-700"
        };
      case "Aggressive":
        return {
          bg: "bg-red-50",
          border: "border-red-200",
          title: "text-red-800",
          badge: "bg-red-100 text-red-800",
          description: "text-red-700"
        };
      default:
        return {
          bg: "bg-gray-50",
          border: "border-gray-200",
          title: "text-gray-800",
          badge: "bg-gray-100 text-gray-800",
          description: "text-gray-700"
        };
    }
  };

  if (loading) {
    return (
      <div>
        <Header searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
        <div className="flex w-full">
          <div className="min-h-screen">
            <SideBar />
          </div>
          <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center font-sans p-6 w-full">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600 mx-auto mb-4"></div>
              <p className="text-lg text-gray-600">กำลังโหลดผลการทดสอบ...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <Header searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
        <div className="flex w-full">
          <div className="min-h-screen">
            <SideBar />
          </div>
          <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center font-sans p-6 w-full">
            <div className="text-center">
              <div className="text-red-500 text-lg mb-4">{error}</div>
              <button
                onClick={() => window.location.reload()}
                className="bg-teal-600 hover:bg-teal-700 text-white font-bold py-2 px-4 rounded cursor-pointer"
              >
                ลองใหม่อีกครั้ง
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!user || user.quiz_score === undefined || user.quiz_score === null || user.quiz_score === 0) {
    return (
      <div>
        <Header searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
        <div className="flex w-full">
          <div className="min-h-screen">
            <SideBar />
          </div>
          <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center font-sans p-6 w-full">
            <div className="text-center">
              <p className="text-lg text-gray-600 mb-4">คุณยังไม่ได้ทำการทดสอบ</p>
              <a 
                onClick={()=>navigate('/quizPage')}
                className="bg-teal-600 hover:bg-teal-700 text-white font-bold py-2 px-4 rounded inline-block"
              >
                ไปทำแบบทดสอบ
              </a>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const colors = userResult ? getColorScheme(userResult.name) : getColorScheme("default");

  return (
    <div>
      <Header searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
      <div className="flex w-full">
        <div className="min-h-screen">
          <SideBar />
        </div>
        <div className="min-h-screen bg-gray-50 flex flex-col items-center font-sans p-6 w-full">
          <div className="max-w-4xl w-full bg-white shadow-lg rounded-2xl p-8 space-y-8">
            <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">
              ผลการทดสอบของคุณ
            </h1>

            {userResult && (
              <div
                className={`${colors.bg} ${colors.border} border-2 rounded-2xl p-8 space-y-6`}
              >
                {/* Score Display */}
                <div className="text-center">
                  <div className="text-6xl font-bold text-gray-800 mb-2">
                    {user.quiz_score}
                  </div>
                  <div className="text-gray-600">คะแนนของคุณ</div>
                </div>

                {/* Investor Type */}
                <div className="text-center">
                  <div
                    className={`inline-block ${colors.badge} px-6 py-3 rounded-full text-lg font-semibold mb-4`}
                  >
                    {userResult.name}
                  </div>
                  <h2 className={`text-2xl font-bold ${colors.title} mb-4`}>
                    คุณเป็นนักลงทุนแบบ {userResult.name}
                  </h2>
                </div>

                {/* Description */}
                <div
                  className={`${colors.description} text-lg leading-relaxed text-center max-w-3xl mx-auto`}
                >
                  {userResult.description}
                </div>

                {/* Score Range */}
                <div className="text-center mt-6">
                  <div className="text-sm text-gray-600">
                    ช่วงคะแนน: {userResult.min_score} - {userResult.max_score}{" "}
                    คะแนน
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex justify-center space-x-4 mt-8">
                  <a
                    onClick={() => navigate("/quizPage")}
                    className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-xl font-semibold transition cursor-pointer"
                  >
                    ทำแบบทดสอบใหม่
                  </a>
                  <a
                    onClick={() => navigate("/home")}
                    className="bg-teal-600 hover:bg-teal-700 text-white px-6 py-3 rounded-xl font-semibold transition cursor-pointer"
                  >
                    กลับหน้าหลัก
                  </a>
                </div>
              </div>
            )}

            {/* All Investor Types Overview */}
            <div className="mt-12">
              <h3 className="text-xl font-bold text-gray-800 mb-6 text-center">
                ประเภทนักลงทุนทั้งหมด
              </h3>
              <div className="grid gap-4">
                {investorTypes.map((type, index) => {
                  const isUserType = userResult?.name === type.name;
                  const typeColors = getColorScheme(type.name);

                  return (
                    <div
                      key={index}
                      className={`p-4 rounded-xl border-2 transition-all ${
                        isUserType
                          ? `${typeColors.bg} ${typeColors.border} shadow-md`
                          : "bg-gray-50 border-gray-200"
                      }`}
                    >
                      <div className="flex justify-between items-center mb-2">
                        <h4
                          className={`font-semibold text-lg ${
                            isUserType ? typeColors.title : "text-gray-700"
                          }`}
                        >
                          {type.name}
                          {isUserType && (
                            <span className="ml-2 text-sm bg-teal-600 text-white px-2 py-1 rounded-full">
                              คุณ
                            </span>
                          )}
                        </h4>
                        <span
                          className={`text-sm px-3 py-1 rounded-full ${
                            isUserType
                              ? typeColors.badge
                              : "bg-gray-100 text-gray-600"
                          }`}
                        >
                          {type.min_score}-{type.max_score} คะแนน
                        </span>
                      </div>
                      <p
                        className={`text-sm ${
                          isUserType ? typeColors.description : "text-gray-600"
                        }`}
                      >
                        {type.description}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuizResultPage;