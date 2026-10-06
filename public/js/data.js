/**
 * CodeNest Platform - Central Mock Data Store
 * Separated from HTML templates for easy future REST/GraphQL API integration.
 */

const CodeNestData = {
  // Current Authenticated User (Generic Demo)
  currentUser: {
    id: 'usr_001',
    name: 'Alex Morgan',
    username: 'alexmorgan',
    email: 'student@codenest.dev',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    bio: 'Aspiring Full Stack Engineer passionate about JavaScript, Node.js, and Cloud Computing.',
    joinedDate: 'Tháng 1, 2026',
    role: 'Student',
    stats: {
      enrolledCourses: 3,
      completedCourses: 1,
      totalHours: 46.5,
      currentStreak: 12
    },
    enrolledCourses: [
      { courseId: 'js-fundamentals', progress: 72, lastLessonId: 'js-les-08' },
      { courseId: 'python-basics', progress: 45, lastLessonId: 'py-les-04' },
      { courseId: 'csharp-dotnet', progress: 30, lastLessonId: 'cs-les-03' }
    ],
    wishlist: ['html-css-mastery', 'sql-databases'],
    completedLessons: ['js-les-01', 'js-les-02', 'js-les-03', 'js-les-04', 'js-les-05', 'js-les-06', 'js-les-07', 'py-les-01', 'py-les-02']
  },

  // Notification Feed
  notifications: [
    {
      id: 'notif_1',
      title: 'Tiến độ học tập xuất sắc',
      message: 'Bạn đã đạt 72% khóa học JavaScript Fundamentals. Hãy tiếp tục phát huy!',
      time: '10 phút trước',
      read: false,
      icon: 'fa-trophy',
      color: '#3b82f6'
    },
    {
      id: 'notif_2',
      title: 'Bài học mới đã cập nhật',
      message: 'Chương 4: Async/Await & Fetch API vừa được bổ sung vào khóa học JavaScript.',
      time: '2 giờ trước',
      read: false,
      icon: 'fa-book-open',
      color: '#10b981'
    },
    {
      id: 'notif_3',
      title: 'Chào mừng bạn đến với CodeNest',
      message: 'Khởi đầu lộ trình học lập trình vững chắc từ hôm nay cùng hơn 10.000 học viên.',
      time: '2 ngày trước',
      read: true,
      icon: 'fa-sparkles',
      color: '#8b5cf6'
    }
  ],

  // Platform Learning Paths
  learningPaths: [
    {
      id: 'path-frontend',
      title: 'Frontend Development',
      desc: 'Làm chủ HTML, CSS, JavaScript hiện đại, responsive design và kiến trúc ứng dụng web tương tác.',
      coursesCount: 8,
      duration: '60 giờ',
      icon: 'fa-code',
      color: '#3b82f6',
      badge: 'Phổ biến nhất'
    },
    {
      id: 'path-backend',
      title: 'Backend Development',
      desc: 'Xây dựng API bảo mật, xử lý dữ liệu quy mô lớn với Node.js, Python, C# và cơ sở dữ liệu quan hệ.',
      coursesCount: 10,
      duration: '85 giờ',
      icon: 'fa-server',
      color: '#10b981',
      badge: 'Nhu cầu cao'
    },
    {
      id: 'path-fullstack',
      title: 'Full Stack Development',
      desc: 'Kết hợp toàn diện Frontend và Backend để xây dựng sản phẩm SaaS hoàn chỉnh từ A đến Z.',
      coursesCount: 14,
      duration: '120 giờ',
      icon: 'fa-layer-group',
      color: '#8b5cf6',
      badge: 'Lộ trình toàn diện'
    },
    {
      id: 'path-data-ai',
      title: 'Data & AI Foundations',
      desc: 'Khám phá Python cho xử lý dữ liệu, trực quan hóa và ứng dụng trí tuệ nhân tạo hiện đại.',
      coursesCount: 6,
      duration: '50 giờ',
      icon: 'fa-brain',
      color: '#06b6d4',
      badge: 'Xu hướng mới'
    },
    {
      id: 'path-database',
      title: 'Database Architecture',
      desc: 'Thiết kế lược đồ SQL, tối ưu hóa truy vấn hiệu năng cao và quản trị dữ liệu an toàn.',
      coursesCount: 5,
      duration: '35 giờ',
      icon: 'fa-database',
      color: '#f59e0b',
      badge: 'Nền tảng cốt lõi'
    }
  ],

  // Comprehensive Courses Database
  courses: [
    {
      id: 'js-fundamentals',
      slug: 'javascript-fundamentals',
      title: 'JavaScript Fundamentals: From Zero to Modern Hero',
      category: 'Frontend',
      language: 'JavaScript',
      level: 'Beginner',
      duration: '18.5 giờ',
      lessonsCount: 36,
      rating: 4.9,
      reviewsCount: 1240,
      studentsCount: 6420,
      instructor: {
        name: 'Sarah Jenkins',
        title: 'Senior Frontend Architect',
        avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=120&auto=format&fit=crop&q=80'
      },
      lastUpdated: 'Tháng 2, 2026',
      thumbnailBg: 'linear-gradient(135deg, #f59e0b 0%, #fbbf24 100%)',
      iconClass: 'fa-js',
      description: 'Làm chủ ngôn ngữ lập trình phổ biến nhất thế giới. Từ tư duy logic, cấu trúc biến, hàm, closures, DOM manipulation đến lập trình bất đồng bộ với Promises và Async/Await.',
      whatYouWillLearn: [
        'Hiểu sâu cơ chế hoạt động của JavaScript runtime, Call Stack và Event Loop.',
        'Sử dụng thành thạo các tính năng hiện đại của ES6+ (Destructuring, Arrow functions, Modules).',
        'Thao tác thuần thục với DOM, xử lý sự kiện người dùng và validate biểu mẫu.',
        'Gọi RESTful APIs với Fetch/Async-Await và xử lý lỗi chuyên nghiệp.'
      ],
      requirements: [
        'Kiến thức cơ bản về HTML và CSS là lợi thế (nhưng không bắt buộc).',
        'Máy tính cài đặt trình duyệt hiện đại (Chrome/Firefox/Edge) và trình soạn thảo mã nguồn.'
      ],
      curriculum: [
        {
          sectionId: 'sec-1',
          title: 'Chương 1: Cú pháp cốt lõi & Tư duy lập trình',
          lessons: [
            { id: 'js-les-01', title: 'Giới thiệu JavaScript & Chạy dòng lệnh đầu tiên', duration: '12 phút', free: true },
            { id: 'js-les-02', title: 'Biến và kiểu dữ liệu (var, let, const)', duration: '18 phút', free: true },
            { id: 'js-les-03', title: 'Toán tử số học, logic và ép kiểu ngầm định', duration: '15 phút', free: false },
            { id: 'js-les-04', title: 'Cấu trúc rẽ nhánh if/else và switch-case', duration: '20 phút', free: false }
          ]
        },
        {
          sectionId: 'sec-2',
          title: 'Chương 2: Hàm, Phạm vi (Scope) & Closures',
          lessons: [
            { id: 'js-les-05', title: 'Function Declaration vs Function Expression', duration: '16 phút', free: false },
            { id: 'js-les-06', title: 'Arrow Functions và ngữ cảnh từ khóa this', duration: '22 phút', free: false },
            { id: 'js-les-07', title: 'Scope Chain & Lexical Environment', duration: '25 phút', free: false },
            { id: 'js-les-08', title: 'Variables in JavaScript: Deep Dive into Hoisting', duration: '24 phút', free: false },
            { id: 'js-les-09', title: 'Closures và ứng dụng bảo mật dữ liệu thực tế', duration: '28 phút', free: false }
          ]
        },
        {
          sectionId: 'sec-3',
          title: 'Chương 3: Làm việc với Mảng, Đối tượng & ES6+',
          lessons: [
            { id: 'js-les-10', title: 'Mảng và các Higher-Order methods (map, filter, reduce)', duration: '30 phút', free: false },
            { id: 'js-les-11', title: 'Đối tượng (Object), Destructuring và Spread Operator', duration: '24 phút', free: false }
          ]
        },
        {
          sectionId: 'sec-4',
          title: 'Chương 4: Lập trình bất đồng bộ (Async/Await)',
          lessons: [
            { id: 'js-les-12', title: 'Callback Hell và sự ra đời của Promises', duration: '25 phút', free: false },
            { id: 'js-les-13', title: 'Async/Await cú pháp đồng bộ cho mã bất đồng bộ', duration: '32 phút', free: false }
          ]
        }
      ]
    },
    {
      id: 'python-basics',
      slug: 'python-for-beginners',
      title: 'Python for Beginners: From Basics to Real Projects',
      category: 'Backend',
      language: 'Python',
      level: 'Beginner',
      duration: '15.0 giờ',
      lessonsCount: 30,
      rating: 4.85,
      reviewsCount: 980,
      studentsCount: 5210,
      instructor: {
        name: 'David Chen',
        title: 'Data Engineer & Python Specialist',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80'
      },
      lastUpdated: 'Tháng 1, 2026',
      thumbnailBg: 'linear-gradient(135deg, #0284c7 0%, #38bdf8 100%)',
      iconClass: 'fa-python',
      description: 'Khóa học lập trình Python toàn diện cho người mới bắt đầu. Học cú pháp trong sáng, lập trình hướng đối tượng (OOP), xử lý file, thao tác dữ liệu và tự động hóa tác vụ lặp lại.',
      whatYouWillLearn: [
        'Nắm vững cú pháp cơ bản và các cấu trúc dữ liệu chính trong Python.',
        'Xây dựng các chương trình tương tác dòng lệnh và tự động hóa công việc.',
        'Lập trình hướng đối tượng: Classes, Objects, Inheritance.',
        'Đọc/ghi file CSV, JSON và kết nối API bên ngoài.'
      ],
      requirements: ['Không yêu cầu kinh nghiệm lập trình trước đó.'],
      curriculum: [
        {
          sectionId: 'py-sec-1',
          title: 'Phần 1: Nhập môn Python',
          lessons: [
            { id: 'py-les-01', title: 'Cài đặt môi trường Python 3 & VS Code', duration: '14 phút', free: true },
            { id: 'py-les-02', title: 'Cú pháp cơ bản, biến và quy tắc thụt đầu dòng (Indentation)', duration: '19 phút', free: true },
            { id: 'py-les-03', title: 'Vòng lặp for/while và list comprehension', duration: '22 phút', free: false },
            { id: 'py-les-04', title: 'Xây dựng hàm tái sử dụng trong Python', duration: '20 phút', free: false }
          ]
        }
      ]
    },
    {
      id: 'csharp-dotnet',
      slug: 'csharp-dotnet-core',
      title: 'C# & .NET Core Enterprise API Architecture',
      category: 'Backend',
      language: 'C#',
      level: 'Intermediate',
      duration: '22.0 giờ',
      lessonsCount: 42,
      rating: 4.92,
      reviewsCount: 650,
      studentsCount: 3100,
      instructor: {
        name: 'Michael Vance',
        title: 'Enterprise Solution Architect',
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&auto=format&fit=crop&q=80'
      },
      lastUpdated: 'Tháng 2, 2026',
      thumbnailBg: 'linear-gradient(135deg, #7c3aed 0%, #a855f7 100%)',
      iconClass: 'fa-microsoft',
      description: 'Học cách thiết kế hệ thống backend cấp doanh nghiệp với C# hiện đại và .NET Core. Xây dựng RESTful APIs hiệu năng cao, áp dụng Clean Architecture, Entity Framework Core và Unit Testing.',
      whatYouWillLearn: [
        'Lập trình hướng đối tượng nâng cao, Generics, LINQ và Async Programming trong C#.',
        'Thiết kế REST API chuẩn mực với ASP.NET Core và Dependency Injection.',
        'Tương tác cơ sở dữ liệu với Entity Framework Core và Code-First Migrations.',
        'Áp dụng kiến trúc Clean Architecture và Repository Pattern.'
      ],
      requirements: ['Hiểu biết cơ bản về lập trình hướng đối tượng (OOP).'],
      curriculum: [
        {
          sectionId: 'cs-sec-1',
          title: 'Phần 1: Nền tảng C# hiện đại',
          lessons: [
            { id: 'cs-les-01', title: 'Tổng quan hệ sinh thái .NET và cấu trúc dự án', duration: '15 phút', free: true },
            { id: 'cs-les-02', title: 'OOP trong C#: Interface, Abstract Class & Polymorphism', duration: '28 phút', free: true },
            { id: 'cs-les-03', title: 'LINQ & Thao tác tập hợp dữ liệu nâng cao', duration: '30 phút', free: false }
          ]
        }
      ]
    },
    {
      id: 'html-css-mastery',
      slug: 'html-css-mastery',
      title: 'HTML5 & Modern CSS3: From Layout to Polish',
      category: 'Frontend',
      language: 'HTML/CSS',
      level: 'Beginner',
      duration: '14.0 giờ',
      lessonsCount: 24,
      rating: 4.88,
      reviewsCount: 1450,
      studentsCount: 8200,
      instructor: {
        name: 'Elena Rostova',
        title: 'UI/UX & CSS Specialist',
        avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=120&auto=format&fit=crop&q=80'
      },
      lastUpdated: 'Tháng 1, 2026',
      thumbnailBg: 'linear-gradient(135deg, #ea580c 0%, #f97316 100%)',
      iconClass: 'fa-html5',
      description: 'Xây dựng giao diện web chuẩn responsive, thẩm mỹ cao và chuẩn semantic accessibility. Làm chủ Flexbox, CSS Grid, Custom Properties (Variables), Animations và chuyển động vi mô mượt mà.',
      whatYouWillLearn: [
        'Cấu trúc tài liệu chuẩn SEO & Accessibility với Semantic HTML5.',
        'Làm chủ 100% Flexbox và CSS Grid cho mọi loại bố cục giao diện.',
        'Tối ưu hóa hiển thị responsive từ điện thoại đến màn hình siêu rộng.',
        'Tạo hiệu ứng hover, transition và animation nhẹ nhàng, chuyên nghiệp.'
      ],
      requirements: ['Không yêu cầu kiến thức lập trình trước.'],
      curriculum: [
        {
          sectionId: 'hc-sec-1',
          title: 'Phần 1: HTML5 Semantic Foundation',
          lessons: [
            { id: 'hc-les-01', title: 'Cấu trúc tài liệu HTML5 & Semantic Elements', duration: '15 phút', free: true },
            { id: 'hc-les-02', title: 'Forms hiện đại và validation chuẩn HTML', duration: '20 phút', free: true }
          ]
        }
      ]
    },
    {
      id: 'java-programming',
      slug: 'java-masterclass',
      title: 'Java Masterclass: OOP, Data Structures & Concurrency',
      category: 'Backend',
      language: 'Java',
      level: 'Intermediate',
      duration: '26.0 giờ',
      lessonsCount: 40,
      rating: 4.82,
      reviewsCount: 790,
      studentsCount: 3900,
      instructor: {
        name: 'Robert Zhang',
        title: 'Principal Software Engineer',
        avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=120&auto=format&fit=crop&q=80'
      },
      lastUpdated: 'Tháng 2, 2026',
      thumbnailBg: 'linear-gradient(135deg, #b91c1c 0%, #ef4444 100%)',
      iconClass: 'fa-java',
      description: 'Nắm vững tư duy lập trình hướng đối tượng kinh điển, cấu trúc dữ liệu, giải thuật, Collections Framework, xử lý đa luồng (Concurrency) và thiết kế hệ thống Java quy mô lớn.',
      whatYouWillLearn: [
        'Tư duy hướng đối tượng kinh điển: Đóng gói, Kế thừa, Đa hình, Trừu tượng.',
        'Làm chủ Java Collections: List, Set, Map và phân tích độ phức tạp Big-O.',
        'Lập trình đa luồng an toàn với Concurrency Utilities và Thread Pools.',
        'Áp dụng Design Patterns phổ biến (Singleton, Factory, Observer).'
      ],
      requirements: ['Tư duy logic cơ bản.'],
      curriculum: [
        {
          sectionId: 'jv-sec-1',
          title: 'Phần 1: Java Core & OOP',
          lessons: [
            { id: 'jv-les-01', title: 'Kiến trúc JVM, JRE và JDK', duration: '18 phút', free: true },
            { id: 'jv-les-02', title: 'Thiết kế Class và Object chuẩn mực', duration: '24 phút', free: true }
          ]
        }
      ]
    },
    {
      id: 'sql-databases',
      slug: 'sql-relational-databases',
      title: 'SQL & Relational Database Design: Zero to DBA',
      category: 'Database',
      language: 'SQL',
      level: 'All Levels',
      duration: '12.5 giờ',
      lessonsCount: 20,
      rating: 4.94,
      reviewsCount: 890,
      studentsCount: 4500,
      instructor: {
        name: 'Amanda Brooks',
        title: 'Database Architect & Performance Tuning',
        avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=120&auto=format&fit=crop&q=80'
      },
      lastUpdated: 'Tháng 1, 2026',
      thumbnailBg: 'linear-gradient(135deg, #0d9488 0%, #14b8a6 100%)',
      iconClass: 'fa-database',
      description: 'Làm chủ ngôn ngữ truy vấn có cấu trúc SQL. Thiết kế lược đồ cơ sở dữ liệu chuẩn hóa, viết câu lệnh JOINs phức tạp, lập chỉ mục (Indexing), tối ưu hóa hiệu năng và quản trị giao dịch (Transactions).',
      whatYouWillLearn: [
        'Viết truy vấn từ cơ bản đến phức tạp (Subqueries, Window Functions, CTEs).',
        'Thiết kế cơ sở dữ liệu chuẩn hóa (1NF, 2NF, 3NF) và quan hệ khóa ngoại.',
        'Tối ưu hóa tốc độ truy vấn với Indexes và giải thích Execution Plan.',
        'Quản lý giao dịch ACID để đảm bảo tính toàn vẹn dữ liệu.'
      ],
      requirements: ['Không yêu cầu kiến thức kỹ thuật nâng cao.'],
      curriculum: [
        {
          sectionId: 'sql-sec-1',
          title: 'Phần 1: Truy vấn căn bản & Thao tác dữ liệu',
          lessons: [
            { id: 'sql-les-01', title: 'Cơ sở dữ liệu quan hệ là gì? Cài đặt PostgreSQL/MySQL', duration: '15 phút', free: true },
            { id: 'sql-les-02', title: 'Lệnh SELECT, WHERE, ORDER BY và toán tử lọc', duration: '22 phút', free: true }
          ]
        }
      ]
    }
  ],

  // Platform Testimonials
  testimonials: [
    {
      id: 'test-1',
      name: 'Nguyễn Văn Minh',
      role: 'Junior Frontend Developer',
      company: 'Tech Solutions Inc.',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80',
      rating: 5,
      content: 'CodeNest đã thay đổi hoàn toàn cách tôi tiếp cận lập trình. Thay vì chỉ xem video thụ động, mỗi bài học đều có bài tập thực hành trực quan giúp tôi tự tin vượt qua các vòng phỏng vấn kỹ thuật.'
    },
    {
      id: 'test-2',
      name: 'Trần Thị Mai',
      role: 'Backend Engineer',
      company: 'Cloud Scale Vietnam',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80',
      rating: 5,
      content: 'Khóa học C# & .NET Core trên nền tảng cực kỳ chất lượng. Kiến trúc bài giảng rõ ràng, đi thẳng vào các bài toán thực tế của doanh nghiệp thay vì chỉ dạy lý thuyết suông.'
    },
    {
      id: 'test-3',
      name: 'Lê Hoàng Nam',
      role: 'Computer Science Student',
      company: 'Đại học Bách Khoa',
      avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=100&auto=format&fit=crop&q=80',
      rating: 5,
      content: 'Giao diện sáng sủa, thanh thoát và không gây mỏi mắt khi học lâu. Tiến độ học tập và hệ thống theo dõi streak thúc đẩy tôi duy trì thói quen viết code mỗi ngày.'
    }
  ],

  // Admin Mock Database: Users
  adminUsers: [
    {
      id: 'usr_001',
      name: 'Alex Morgan',
      email: 'student@codenest.dev',
      role: 'Student',
      status: 'Active',
      joined: '02/01/2026',
      coursesEnrolled: 3
    },
    {
      id: 'usr_002',
      name: 'David Miller',
      email: 'david.miller@example.com',
      role: 'Student',
      status: 'Active',
      joined: '05/01/2026',
      coursesEnrolled: 2
    },
    {
      id: 'usr_003',
      name: 'Sarah Jenkins',
      email: 'sarah.instructor@codenest.dev',
      role: 'Instructor',
      status: 'Active',
      joined: '15/12/2025',
      coursesEnrolled: 5
    },
    {
      id: 'usr_004',
      name: 'Kenji Sato',
      email: 'kenji.sato@example.com',
      role: 'Student',
      status: 'Inactive',
      joined: '18/01/2026',
      coursesEnrolled: 1
    },
    {
      id: 'usr_005',
      name: 'Platform Administrator',
      email: 'admin@codenest.dev',
      role: 'Admin',
      status: 'Active',
      joined: '01/10/2025',
      coursesEnrolled: 10
    }
  ],

  // Admin Platform Stats
  adminStats: {
    totalUsers: '12,480',
    activeUsers: '1,842',
    totalCourses: '24',
    totalLessons: '680',
    monthlyGrowth: '+18.4%',
    revenueThisMonth: '$38,420'
  }
};

// Export to window for global browser availability
if (typeof window !== 'undefined') {
  window.CodeNestData = CodeNestData;
}
