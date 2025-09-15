import React, { useState, useEffect } from 'react';

interface UserTag {
  tag: string;
  count: number;
}

interface GlobalTag {
  tag: string;
  count: number;
}

interface TagStatsResponse {
  success: boolean;
  globalTags: GlobalTag[];
  userTags: UserTag[];
}

const UserTagsProgress: React.FC = () => {
  const [userTags, setUserTags] = useState<UserTag[]>([]);
  const [globalTags, setGlobalTags] = useState<GlobalTag[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserTagStats = async () => {
      try {
        const storedUserId = sessionStorage.getItem("userId");
        if (!storedUserId) {
          setError("User not found");
          return;
        }

        const userId = JSON.parse(storedUserId);
        
        const response = await fetch(`http://localhost:3001/getTagStat/${userId}`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch tag stats');
        }

        const data: TagStatsResponse = await response.json();
        
        if (data.success) {
          const top3UserTags = data.userTags.slice(0, 3);
          setUserTags(top3UserTags);
          setGlobalTags(data.globalTags);
        } else {
          setError('Failed to load tag statistics');
        }
      } catch (err) {
        console.error('Error fetching user tag stats:', err);
        setError('Failed to load tag statistics');
      } finally {
        setLoading(false);
      }
    };

    fetchUserTagStats();
  }, []);

  const calculatePercentage = (userCount: number, tagName: string): number => {
    const globalTag = globalTags.find(tag => tag.tag === tagName);
    if (!globalTag || globalTag.count === 0) return 0;
    
    return Math.round((userCount / globalTag.count) * 100);
  };

  if (loading) {
    return (
      <div>
        <h2 className="text-xl font-bold text-gray-800 mb-4 ml-20">
          ความคืบหน้า
        </h2>
        <div className="rounded-lg shadow-md p-6 mx-20 mb-8 bg-gray-200">
          <div className="text-center text-gray-600">กำลังโหลด...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <h2 className="text-xl font-bold text-gray-800 mb-4 ml-20">
          ความคืบหน้า
        </h2>
        <div className="rounded-lg shadow-md p-6 mx-20 mb-8 bg-gray-200">
          <div className="text-center text-red-600">{error}</div>
        </div>
      </div>
    );
  }

  if (userTags.length === 0) {
    return (
      <div>
        <h2 className="text-xl font-bold text-gray-800 mb-4 ml-20">
          ความคืบหน้า
        </h2>
        <div className="rounded-lg shadow-md p-6 mx-20 mb-8 bg-gray-200">
          <div className="text-center text-gray-600">
            ยังไม่มีความคืบหน้า
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-xl font-bold text-gray-800 mb-4 ml-20">
        ความคืบหน้า
      </h2>
      <div className="rounded-lg shadow-md p-6 mx-20 mb-8 bg-gray-200">
        <div className="space-y-4">
          {userTags.map((userTag, index) => {
            const percentage = calculatePercentage(userTag.count, userTag.tag);
            const globalTag = globalTags.find(tag => tag.tag === userTag.tag);
            const globalCount = globalTag ? globalTag.count : 0;
            
            return (
              <div key={userTag.tag}>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-black">
                    {userTag.tag}
                  </span>
                  <span className="text-sm text-black">
                    {percentage}% ({userTag.count}/{globalCount})
                  </span>
                </div>
                <div className="w-full bg-gray-300 rounded-full h-2">
                  <div
                    className="bg-black h-2 rounded-full transition-all duration-300"
                    style={{ width: `${percentage}%` }}
                  ></div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default UserTagsProgress;