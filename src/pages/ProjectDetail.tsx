import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, LayoutGrid, Calendar } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';

export function ProjectDetail() {
    const { id } = useParams();

    return (
        <div className="p-6 max-w-7xl mx-auto space-y-6">
            <div className="flex items-center gap-4 mb-6">
                <Link to="/projects" className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-slate-500 transition-colors">
                    <ArrowLeft className="w-5 h-5" />
                </Link>
                <div>
                    <div className="flex items-center gap-3">
                        <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Project Details</h1>
                        <Badge variant="success">Active</Badge>
                    </div>
                    <p className="text-slate-500 dark:text-slate-400 mt-1">Viewing details for project {id}</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-2 space-y-6">
                    <Card>
                        <CardHeader className="bg-slate-50 dark:bg-slate-900/50">
                            <CardTitle className="text-lg flex items-center gap-2">
                                <LayoutGrid className="w-5 h-5 text-blue-500" />
                                Overview
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-6">
                            <p className="text-slate-600 dark:text-slate-400">
                                This is a placeholder detail view for project {id}. In a fully implemented system, this page would fetch and display the project's specific tasks, timeline, team members, and overall progress.
                            </p>
                        </CardContent>
                    </Card>
                </div>
                <div className="space-y-6">
                    <Card>
                        <CardHeader className="bg-slate-50 dark:bg-slate-900/50">
                            <CardTitle className="text-lg flex items-center gap-2">
                                <Calendar className="w-5 h-5 text-green-500" />
                                Timeline
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-6">
                            <p className="text-sm text-slate-600 dark:text-slate-400">Due Date: TBD</p>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
