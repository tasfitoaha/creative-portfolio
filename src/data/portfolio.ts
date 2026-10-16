export const BRAND = {
  name: 'Haniw Mejelin',
  subtitle:
    'Creative explorer specializing in vector graphic layout configurations, psychological literature composition, and background script automation utilities.',
  contacts: {
    primary: 'haniwmejelin@gmail.com',
    secondary: 'tasfitoaha@gmail.com',
    mobile: '+8801611389741',
  },
  socials: {
    facebook: 'https://www.facebook.com/haniw.mejelin',
    github: 'https://github.com/tasfitoaha',
  },
};

export type PageId = 'home' | 'writing' | 'specialties' | 'info' | 'message' | 'pythagorean' | 'mathviz';

export interface WritingEntry {
  title: string;
  tag: string;
  note: string;
  status: 'forthcoming' | 'archival' | 'restricted';
}

export const WRITINGS: WritingEntry[] = [
  {
    title: 'An Attempt on Fear',
    tag: 'Forthcoming publication after October 2026',
    note: 'Psychology book analyzing human fear mechanics, subconscious habits, horror themes, and the uncanny valley.',
    status: 'forthcoming',
  },
  {
    title: 'Myriad',
    tag: 'Forthcoming publication after October 2026',
    note: 'Dual-language conceptual reflection layout.',
    status: 'forthcoming',
  },
  {
    title: 'srirumanhun doetabaz',
    tag: 'Archival',
    note: 'Archival early developmental text experiment.',
    status: 'archival',
  },
  {
    title: 'deeath',
    tag: 'Restricted',
    note: 'Closed internal project. Permanently unreleased information hazard; restricted from distribution.',
    status: 'restricted',
  },
];

export interface ScriptEntry {
  filename: string;
  language: string;
  description: string;
  code: string;
}

export const SCRIPTS: ScriptEntry[] = [
  {
    filename: 'SearchDocs.ps1',
    language: 'powershell',
    description: 'Recursively searches all document files in a target directory by keyword.',
    code: `<#
.SYNOPSIS
  SearchDocs.ps1 — Recursively search document files by keyword
.DESCRIPTION
  Scans .docx, .pdf, .txt, and .md files in the target path for a keyword match.
.PARAMETER Path
  Root directory to search
.PARAMETER Keyword
  Text to find inside each document
#>
param(
  [Parameter(Mandatory=$true)]
  [string]$Path,

  [Parameter(Mandatory=$true)]
  [string]$Keyword
)

$extensions = @('*.docx','*.pdf','*.txt','*.md')
$results = @()

foreach ($ext in $extensions) {
  $files = Get-ChildItem -Path $Path -Filter $ext -Recurse -File
  foreach ($file in $files) {
    $content = Get-Content $file.FullName -Raw -ErrorAction SilentlyContinue
    if ($content -match $Keyword) {
      $results += [PSCustomObject]@{
        File    = $file.FullName
        Match   = $Keyword
        Size    = [math]::Round($file.Length / 1KB, 1)
        Modified= $file.LastWriteTime.ToString('yyyy-MM-dd')
      }
    }
  }
}

if ($results.Count -eq 0) {
  Write-Host "No matches found for '$Keyword'." -ForegroundColor Yellow
} else {
  $results | Format-Table -AutoSize
  Write-Host "$($results.Count) file(s) matched." -ForegroundColor Green
}`,
  },
  {
    filename: 'StartMonitor.vbs',
    language: 'vbscript',
    description: 'Silently launches a background monitoring process at user logon.',
    code: `' StartMonitor.vbs — Silent background monitor launcher
' Launches the monitoring script without a visible console window.

Option Explicit

Dim shell, fso, scriptPath

Set shell = CreateObject("WScript.Shell")
Set fso   = CreateObject("Scripting.FileSystemObject")

scriptPath = fso.BuildPath(fso.GetParentFolderName(WScript.ScriptFullName), "monitor.vbs")

If fso.FileExists(scriptPath) Then
  shell.Run "wscript.exe """ & scriptPath & """", 0, False
Else
  WScript.Echo "monitor.vbs not found in script directory."
End If

Set shell = Nothing
Set fso   = Nothing`,
  },
  {
    filename: 'OptimizeSystem.bat',
    language: 'batch',
    description: 'Cleans temp files, clears DNS cache, and defrags the system drive.',
    code: `@echo off
REM ============================================
REM  OptimizeSystem.bat — System cleanup utility
REM ============================================
title System Optimizer

echo.
echo  [1/4] Cleaning temporary files...
del /q /f /s "%TEMP%\\*"  >nul 2>&1
del /q /f /s "C:\\Windows\\Temp\\*" >nul 2>&1

echo  [2/4] Clearing DNS resolver cache...
ipconfig /flushdns >nul 2>&1

echo  [3/4] Running disk cleanup (silent)...
cleanmgr /sagerun:1 >nul 2>&1

echo  [4/4] Defragmenting system drive...
defrag C: /O /U /V

echo.
echo  Optimization complete.
timeout /t 3 /nobreak >nul
exit /b 0`,
  },
];

export interface BrandWork {
  title: string;
  category: string;
  imageUrl: string;
}

export const BRAND_WORKS: BrandWork[] = [
  {
    title: 'Zerofic Business Cards',
    category: 'Business Cards',
    imageUrl:
      'https://images.pexels.com/photos/8489959/pexels-photo-8489959.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
  },
  {
    title: 'Geometric Envelope Flaps',
    category: 'Business Cards',
    imageUrl:
      'https://images.pexels.com/photos/8489954/pexels-photo-8489954.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
  },
  {
    title: 'Hexagonal Card Holders',
    category: 'Business Cards',
    imageUrl:
      'https://images.pexels.com/photos/8490066/pexels-photo-8490066.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
  },
  {
    title: 'Employee ID Badge Mockup',
    category: 'ID Badges',
    imageUrl:
      'https://images.pexels.com/photos/5483072/pexels-photo-5483072.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
  },
  {
    title: 'Medical ID Badge Set',
    category: 'ID Badges',
    imageUrl:
      'https://images.pexels.com/photos/7108127/pexels-photo-7108127.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
  },
  {
    title: 'Publication Vector Template',
    category: 'Publication Templates',
    imageUrl:
      'https://images.pexels.com/photos/12024889/pexels-photo-12024889.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
  },
  {
    title: 'Magazine Layout Template',
    category: 'Publication Templates',
    imageUrl:
      'https://images.pexels.com/photos/7248769/pexels-photo-7248769.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
  },
  {
    title: 'Marketing Flyer — Sale',
    category: 'Marketing Flyers',
    imageUrl:
      'https://images.pexels.com/photos/6114589/pexels-photo-6114589.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
  },
  {
    title: 'Marketing Flyer — Seasonal',
    category: 'Marketing Flyers',
    imageUrl:
      'https://images.pexels.com/photos/38645502/pexels-photo-38645502.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
  },
];

export interface EducationEntry {
  level: string;
  institution: string;
  detail: string;
}

export const EDUCATION: EducationEntry[] = [
  {
    level: 'Primary',
    institution: 'PTI Gazipur',
    detail: 'Completed primary education foundation.',
  },
  {
    level: 'SSC',
    institution: 'Ranibilashmini Govt High School',
    detail: 'Completed Secondary School Certificate',
  },
  {
    level: 'HSC',
    institution: 'Govt Science College, Tejgaon',
    detail: 'Completed Higher Secondary Certificate — Science Group',
  },
];

export interface TechFoundation {
  name: string;
  description: string;
}

export const TECH_FOUNDATIONS: TechFoundation[] = [
  {
    name: 'Flutter & Dart',
    description:
      'Foundations in cross-platform mobile architectures, interface layouts, component trees, and reactive programming workflows.',
  },
  {
    name: 'C Language',
    description:
      'System programming logic, foundational memory structures, algorithmic implementations, and backend compilation.',
  },
  {
    name: 'HTML',
    description:
      'Designing semantic web frameworks, structural layouts, and responsive document matrices.',
  },
];

export interface CoreSpecialty {
  title: string;
  description: string;
}

export const CORE_SPECIALTIES: CoreSpecialty[] = [
  {
    title: 'Creative Graphic Systems',
    description:
      'Expertise across diverse spatial asset layouts — including vector line art, UI/UX concept design, dynamic info tables, dithered micro-textures, branding logos, marketing flyers, business cards, letterboxes, custom ID badges, and functional game card matrices.',
  },
  {
    title: 'Workspace Optimization & Custom Start Pages',
    description:
      'Engineering minimalist, high-focus custom browser launch dashboards — integrating real-time digital clocks, dynamic date parameters, and functional, grid-based micro-link layouts overlaid across high-fidelity atmospheric backgrounds.',
  },
  {
    title: 'Multimedia Audio & Literary Work',
    description:
      'Technical explorations of atmosphere — composing chiptune arpeggios, ambient synthesizers, and atmospheric scores alongside early poetry exploration to aurally and conceptually anchor digital media projects.',
  },
  {
    title: 'Intellectual Focus',
    description:
      'A dedicated interest in acquiring knowledge across diverse foundational areas, exploring complex systems across physics, microbiology, genetics, and comparative history and philosophy.',
  },
];

export interface CreativeStudy {
  title: string;
  category: string;
  description: string;
  imageUrl: string;
}

export const CREATIVE_STUDIES: CreativeStudy[] = [
  {
    title: 'UI/UX Wireframe Concepts',
    category: 'Brand & Layout Systems',
    description:
      'Clean placeholder text mapping out user profile edit portals, browser start pages, and micro-blogging grid interfaces.',
    imageUrl:
      'https://images.pexels.com/photos/1966452/pexels-photo-1966452.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
  },
  {
    title: 'Concert Promotional Media Suite',
    category: 'Brand & Layout Systems',
    description:
      "Full-bleed poster, banner, and promotional flyer assets designed for college music band 'Wings of Dusk', balancing heavy color grading, soft cloud masking, dynamic title typography layers, and textured paper tear details.",
    imageUrl:
      'https://images.pexels.com/photos/1763075/pexels-photo-1763075.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
  },
  {
    title: 'High-Contrast Monochromatic Portrait',
    category: 'Surrealism & Ink Studies',
    description:
      'A clean, high-impact binary stencil portrait utilizing stark shadow partitioning to map out light structures.',
    imageUrl:
      'https://images.pexels.com/photos/2086676/pexels-photo-2086676.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
  },
  {
    title: 'Organic Surreal Interior',
    category: 'Surrealism & Ink Studies',
    description:
      'Detailed ink line study exploring isolated spaces, granular particle degradation, and abstract focal structures blending into a dreamlike interior.',
    imageUrl:
      'https://images.pexels.com/photos/1693671/pexels-photo-1693671.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
  },
  {
    title: 'Geometric Plant Macro Matrix',
    category: 'Dithering & Texture Manifestations',
    description:
      'High-contrast botanical photo manipulation using retro dithered dot patterns and halftone print textures to create a deep, layered purple-tinted organic asset.',
    imageUrl:
      'https://images.pexels.com/photos/1112080/pexels-photo-1112080.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
  },
  {
    title: 'Abstract Solar Eclipsed Form',
    category: 'Dithering & Texture Manifestations',
    description:
      'A dark, moody green graphic balancing soft glowing circular gradients against fine linen grain textures.',
    imageUrl:
      'https://images.pexels.com/photos/957024/forest-trees-perspective-bright-957024.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
  },
];
