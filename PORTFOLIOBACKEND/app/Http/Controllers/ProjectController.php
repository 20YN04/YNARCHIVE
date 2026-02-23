<?php

namespace App\Http\Controllers;

use App\Models\Project;
use Illuminate\Http\JsonResponse;

class ProjectController extends Controller
{
    public function index(): JsonResponse
    {
        $projects = Project::query()
            ->select(['title', 'year', 'category', 'image_url'])
            ->orderByDesc('year')
            ->get()
            ->map(function (Project $project): array {
                return [
                    'title' => $project->title,
                    'year' => $project->year,
                    'category' => $project->category,
                    'imageUrl' => $project->image_url,
                ];
            });

        return response()->json($projects);
    }
}
