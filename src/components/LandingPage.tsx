import React from 'react';
import {
    Container,
    Typography,
    Button,
    Box,
    Card,
    Paper,
    Chip,
    Avatar,
    useTheme,
    alpha,
} from '@mui/material';
import {
    Code,
    Quiz,
    TrendingUp,
    School,
    Work,
    CheckCircle,
    Star,
    Telegram,
    PlayArrow,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { AuthHeader } from './auth';

const LandingPage: React.FC = () => {
    const theme = useTheme();
    const navigate = useNavigate();

    const features = [
        {
            icon: <Quiz />,
            title: "150+ Amaliy Savollar",
            description: "Real dunyodagi vaziyatlarga asoslangan savollar"
        },
        {
            icon: <Code />,
            title: "Turli Formatlar",
            description: "MCQ, True/False, Kod Yozish, Xatoliklarni Topish"
        },
        {
            icon: <TrendingUp />,
            title: "Progress Tracking",
            description: "Qayerda qolganingizni kuzatib boring"
        }
    ];

    const topics = [
        "OOP Principles",
        "LINQ",
        "Delegates & Events",
        "ASP.NET Core",
        "Exception Handling",
        "Entity Framework Core",
        "Async/Await",
        "Design Patterns"
    ];

    const testimonials = [
        {
            text: "Savollar amaliy va intervyularda juda qo'l keladi. Har bir mavzu bo'yicha chuqur tushuncha beradi.",
            author: "Junior Developer",
            rating: 5
        },
        {
            text: "Har kuni 15 daqiqa vaqt ajratib, o'zimni sinab ko'raman. Bilimlarim sezilarli darajada yaxshilandi.",
            author: "Middle Developer",
            rating: 5
        }
    ];

    return (
        <Box>
            {/* Authentication Header */}
            <AuthHeader />

            {/* Hero Section */}
            <Box
                sx={{
                    background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.1)} 0%, ${alpha(theme.palette.secondary.main, 0.1)} 100%)`,
                    py: { xs: 8, md: 12 },
                    textAlign: 'center'
                }}
            >
                <Container maxWidth="lg">
                    <Typography
                        variant="h2"
                        component="h1"
                        gutterBottom
                        sx={{
                            fontWeight: 'bold',
                            fontSize: { xs: '2rem', sm: '2.5rem', md: '3.5rem' },
                            mb: 3
                        }}
                    >
                        C# va .NET bo'yicha bilimlaringizni amaliy savollar bilan mustahkamlang
                    </Typography>
                    <Typography
                        variant="h5"
                        color="text.secondary"
                        sx={{
                            mb: 4,
                            maxWidth: '800px',
                            mx: 'auto',
                            fontSize: { xs: '1rem', sm: '1.25rem' },
                            lineHeight: 1.6
                        }}
                    >
                        O'rganayotgan bo'lsangiz ham, sohada ishlayotgan bo'lsangiz ham — .NET QBank siz uchun yaratilgan. 
                        Har kuni o'zingizni sinab ko'ring va bilimlaringizni chuqurlashtiring.
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
                        <Button
                            variant="contained"
                            size="large"
                            sx={{
                                px: 4,
                                py: 1.5,
                                fontSize: '1.1rem',
                                borderRadius: 2
                            }}
                        >
                            Obuna bo'lish
                        </Button>
                        <Button
                            variant="outlined"
                            size="large"
                            startIcon={<PlayArrow />}
                            onClick={() => navigate('/collections')}
                            sx={{
                                px: 4,
                                py: 1.5,
                                fontSize: '1.1rem',
                                borderRadius: 2
                            }}
                        >
                            Bepul Sinab Ko'ring
                        </Button>
                    </Box>
                </Container>
            </Box>

            {/* Features Section */}
            <Container maxWidth="lg" sx={{ py: 8 }}>
                <Typography
                    variant="h3"
                    component="h2"
                    textAlign="center"
                    gutterBottom
                    sx={{ mb: 6, fontWeight: 'bold' }}
                >
                    .NET QBank nima?
                </Typography>
                <Box sx={{ 
                    display: 'grid', 
                    gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' },
                    gap: 4 
                }}>
                    {features.map((feature, index) => (
                        <Card
                            key={index}
                            sx={{
                                height: '100%',
                                textAlign: 'center',
                                p: 3,
                                transition: 'transform 0.2s',
                                '&:hover': {
                                    transform: 'translateY(-4px)',
                                    boxShadow: theme.shadows[8]
                                }
                            }}
                        >
                            <Box
                                sx={{
                                    width: 64,
                                    height: 64,
                                    borderRadius: '50%',
                                    backgroundColor: alpha(theme.palette.primary.main, 0.1),
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    mx: 'auto',
                                    mb: 2,
                                    color: theme.palette.primary.main
                                }}
                            >
                                {feature.icon}
                            </Box>
                            <Typography variant="h6" gutterBottom fontWeight="bold">
                                {feature.title}
                            </Typography>
                            <Typography color="text.secondary">
                                {feature.description}
                            </Typography>
                        </Card>
                    ))}
                </Box>

                {/* Additional Features */}
                <Box sx={{ mt: 6, textAlign: 'center' }}>
                    <Typography variant="h6" gutterBottom>
                        Qo'shimcha imkoniyatlar:
                    </Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, justifyContent: 'center', mt: 2 }}>
                        <Chip icon={<CheckCircle />} label="Haftalik yangilanish" color="primary" />
                        <Chip icon={<CheckCircle />} label="Instant tahlil" color="primary" />
                        <Chip icon={<CheckCircle />} label="Mavzu bo'yicha kategoriya" color="primary" />
                        <Chip icon={<CheckCircle />} label="Progress tracking" color="primary" />
                    </Box>
                </Box>
            </Container>

            {/* Target Audience */}
            <Box sx={{ backgroundColor: alpha(theme.palette.grey[500], 0.05), py: 8 }}>
                <Container maxWidth="lg">
                    <Typography
                        variant="h3"
                        component="h2"
                        textAlign="center"
                        gutterBottom
                        sx={{ mb: 6, fontWeight: 'bold' }}
                    >
                        Kim uchun mo'ljallangan?
                    </Typography>
                    <Box sx={{ 
                        display: 'grid', 
                        gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' },
                        gap: 4 
                    }}>
                        <Paper
                            sx={{
                                p: 4,
                                textAlign: 'center',
                                height: '100%',
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center'
                            }}
                        >
                            <School sx={{ fontSize: 48, color: theme.palette.primary.main, mb: 2 }} />
                            <Typography variant="h5" gutterBottom fontWeight="bold">
                                Studentlar va Internlar
                            </Typography>
                            <Typography color="text.secondary">
                                C# asoslarini mustahkamlashni istagan va amaliy tajriba orttirmoqchi bo'lgan o'quvchilar uchun
                            </Typography>
                        </Paper>
                        <Paper
                            sx={{
                                p: 4,
                                textAlign: 'center',
                                height: '100%',
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center'
                            }}
                        >
                            <Work sx={{ fontSize: 48, color: theme.palette.primary.main, mb: 2 }} />
                            <Typography variant="h5" gutterBottom fontWeight="bold">
                                Professional Dasturchilar
                            </Typography>
                            <Typography color="text.secondary">
                                Doimiy ravishda o'z bilimlarini yangilab turish va intervyularga tayyorlanish istagan mutaxassislar
                            </Typography>
                        </Paper>
                    </Box>
                </Container>
            </Box>

            {/* Topics */}
            <Container maxWidth="lg" sx={{ py: 8 }}>
                <Typography
                    variant="h3"
                    component="h2"
                    textAlign="center"
                    gutterBottom
                    sx={{ mb: 6, fontWeight: 'bold' }}
                >
                    Mavzular
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, justifyContent: 'center' }}>
                    {topics.map((topic, index) => (
                        <Chip
                            key={index}
                            label={topic}
                            variant="outlined"
                            size="medium"
                            sx={{
                                fontSize: '1rem',
                                py: 3,
                                px: 2,
                                '&:hover': {
                                    backgroundColor: alpha(theme.palette.primary.main, 0.1)
                                }
                            }}
                        />
                    ))}
                </Box>
            </Container>

            {/* Pricing */}
            <Box sx={{ backgroundColor: alpha(theme.palette.grey[500], 0.05), py: 8 }}>
                <Container maxWidth="lg">
                    <Typography
                        variant="h3"
                        component="h2"
                        textAlign="center"
                        gutterBottom
                        sx={{ mb: 6, fontWeight: 'bold' }}
                    >
                        Narxlar
                    </Typography>
                    <Box sx={{ 
                        display: 'flex',
                        justifyContent: 'center',
                        gap: 4,
                        flexWrap: 'wrap'
                    }}>
                        <Card
                            sx={{
                                p: 3,
                                textAlign: 'center',
                                height: '100%',
                                position: 'relative',
                                minWidth: { xs: '100%', sm: '280px' },
                                maxWidth: '320px'
                            }}
                        >
                            <Typography variant="h5" gutterBottom fontWeight="bold">
                                Oylik
                            </Typography>
                            <Typography variant="h3" color="primary" gutterBottom>
                                100,000
                                <Typography component="span" variant="h6" color="text.secondary">
                                    {' '}so'm
                                </Typography>
                            </Typography>
                            <Typography color="text.secondary" sx={{ mb: 3 }}>
                                Barcha savollar va yangilanishlarga kirish
                            </Typography>
                            <Button variant="outlined" fullWidth size="large">
                                Tanlash
                            </Button>
                        </Card>
                        <Card
                            sx={{
                                p: 3,
                                textAlign: 'center',
                                height: '100%',
                                position: 'relative',
                                border: `2px solid ${theme.palette.primary.main}`,
                                transform: 'scale(1.05)',
                                zIndex: 1,
                                minWidth: { xs: '100%', sm: '280px' },
                                maxWidth: '320px'
                            }}
                        >
                            <Chip
                                label="Eng Mashhur"
                                color="primary"
                                sx={{
                                    position: 'absolute',
                                    top: -12,
                                    left: '50%',
                                    transform: 'translateX(-50%)'
                                }}
                            />
                            <Typography variant="h5" gutterBottom fontWeight="bold">
                                Umrbod
                            </Typography>
                            <Typography variant="h3" color="primary" gutterBottom>
                                1,000,000
                                <Typography component="span" variant="h6" color="text.secondary">
                                    {' '}so'm
                                </Typography>
                            </Typography>
                            <Typography color="text.secondary" sx={{ mb: 2 }}>
                                Barcha savollar + kelajakdagi yangilanishlar
                            </Typography>
                            <Box sx={{ mb: 3 }}>
                                <Chip
                                    icon={<Star />}
                                    label="WahidUstoz bilan mock interview"
                                    color="secondary"
                                    size="small"
                                />
                            </Box>
                            <Button variant="contained" fullWidth size="large">
                                Tanlash
                            </Button>
                        </Card>
                    </Box>
                </Container>
            </Box>

            {/* Testimonials */}
            <Container maxWidth="lg" sx={{ py: 8 }}>
                <Typography
                    variant="h3"
                    component="h2"
                    textAlign="center"
                    gutterBottom
                    sx={{ mb: 6, fontWeight: 'bold' }}
                >
                    Foydalanuvchilar fikri
                </Typography>
                <Box sx={{ 
                    display: 'grid', 
                    gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' },
                    gap: 4 
                }}>
                    {testimonials.map((testimonial, index) => (
                        <Card key={index} sx={{ p: 3, height: '100%' }}>
                            <Box sx={{ display: 'flex', mb: 2 }}>
                                {[...Array(testimonial.rating)].map((_, i) => (
                                    <Star key={i} sx={{ color: '#ffc107', fontSize: 20 }} />
                                ))}
                            </Box>
                            <Typography variant="body1" sx={{ mb: 2, fontStyle: 'italic' }}>
                                "{testimonial.text}"
                            </Typography>
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                <Avatar sx={{ width: 32, height: 32, mr: 1 }}>
                                    {testimonial.author.charAt(0)}
                                </Avatar>
                                <Typography variant="body2" color="text.secondary">
                                    {testimonial.author}
                                </Typography>
                            </Box>
                        </Card>
                    ))}
                </Box>
            </Container>

            {/* Final CTA */}
            <Box
                sx={{
                    backgroundColor: theme.palette.primary.main,
                    color: theme.palette.primary.contrastText,
                    py: 8,
                    textAlign: 'center'
                }}
            >
                <Container maxWidth="md">
                    <Typography variant="h4" gutterBottom fontWeight="bold">
                        Bugun o'zingizni sinab ko'ring!
                    </Typography>
                    <Typography variant="h6" sx={{ mb: 4, opacity: 0.9 }}>
                        Bilimlaringizni mustahkamlash uchun hoziroq boshlang
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
                        <Button
                            variant="contained"
                            size="large"
                            startIcon={<Telegram />}
                            sx={{
                                backgroundColor: 'white',
                                color: theme.palette.primary.main,
                                '&:hover': {
                                    backgroundColor: alpha('#fff', 0.9)
                                },
                                px: 4,
                                py: 1.5
                            }}
                        >
                            Telegram orqali bog'lanish
                        </Button>
                        <Button
                            variant="outlined"
                            size="large"
                            onClick={() => navigate('/collections')}
                            sx={{
                                borderColor: 'white',
                                color: 'white',
                                '&:hover': {
                                    borderColor: 'white',
                                    backgroundColor: alpha('#fff', 0.1)
                                },
                                px: 4,
                                py: 1.5
                            }}
                        >
                            Ro'yxatdan o'tish
                        </Button>
                    </Box>
                </Container>
            </Box>
        </Box>
    );
};

export default LandingPage; 